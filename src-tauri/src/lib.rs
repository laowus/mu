mod audio_metadata;
mod http_client;
mod setup;
// 仅在桌面环境下导入的模块和类型
#[cfg(desktop)]
use std::path::PathBuf; // 用于处理文件路径的标准库类型
use tauri::Emitter;
#[cfg(desktop)]
use tauri::{AppHandle, Manager, Url}; // AppHandle：应用程序句柄，Manager：窗口管理，Url：URL处理
#[cfg(desktop)]
use tauri_plugin_fs::FsExt;

// 定义用于发送事件的数据结构
#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>, // 命令行参数列表
    cwd: String,       // 当前工作目录
}

#[cfg(desktop)]
fn get_files_from_argv(argv: Vec<String>) -> Vec<PathBuf> {
    let mut files = Vec::new(); // 创建一个新的空向量用于存储文件路径

    // 遍历命令行参数（跳过第一个参数，通常是程序本身的路径）
    for (_, maybe_file) in argv.iter().enumerate().skip(1) {
        // 跳过类似 -f 或 --flag 这样的标志参数
        if maybe_file.starts_with("-") {
            continue;
        }

        // 尝试将参数解析为 URL，处理 file:// 格式的路径
        if let Ok(url) = Url::parse(maybe_file) {
            // 如果是有效的文件 URL，则转换为 PathBuf
            if let Ok(path) = url.to_file_path() {
                files.push(path);
            } else {
                // 否则将其视为普通文件路径
                files.push(PathBuf::from(maybe_file))
            }
        } else {
            // 如果不是有效的 URL，则将其视为普通文件路径
            files.push(PathBuf::from(maybe_file))
        }
    }
    files // 返回提取出的文件路径列表
}

// 仅在桌面环境下可用的函数：允许文件在 Tauri 的安全作用域中访问
#[cfg(desktop)]
fn allow_file_in_scopes(app: &AppHandle, files: Vec<PathBuf>) {
    let fs_scope = app.fs_scope(); // 获取文件系统安全作用域
    let asset_protocol_scope = app.asset_protocol_scope();

    // 为每个文件添加访问权限
    for file in &files {
        // 尝试在文件系统作用域中允许访问该文件
        if let Err(e) = fs_scope.allow_file(file) {
            eprintln!("Failed to allow file in fs_scope: {e}");
        } else {
            println!("Allowed file in fs_scope: {file:?}");
        }

        // 尝试在资源协议作用域中允许访问该文件
        if let Err(e) = asset_protocol_scope.allow_file(file) {
            eprintln!("Failed to allow file in asset_protocol_scope: {e}");
        } else {
            println!("Allowed file in asset_protocol_scope: {file:?}");
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            http_client::http_get_text,
            http_client::http_post_text,
            audio_metadata::get_audio_metadata,
        ]);
    // 仅在桌面环境下初始化窗口状态插件（用于保存和恢复窗口状态）
    #[cfg(desktop)]
    let builder = builder.plugin(tauri_plugin_window_state::Builder::default().build());
    #[cfg(desktop)]
    let builder = builder.plugin(tauri_plugin_updater::Builder::new().build());

    #[cfg(desktop)]
    let builder = builder.plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
        // 当检测到新实例启动时，将焦点设置到主窗口
        let _ = app
            .get_webview_window("main")
            .expect("no main window")
            .set_focus();

        // 从命令行参数中提取文件路径
        let files = get_files_from_argv(argv.clone());

        // 如果有文件参数，允许这些文件在安全作用域中访问
        if !files.is_empty() {
            allow_file_in_scopes(app, files.clone());
        }

        // 向前端发送 "single-instance" 事件，携带命令行参数和工作目录
        app.emit("single-instance", Payload { args: argv, cwd })
            .unwrap();
    }));

    builder
        .setup(setup::setup_app)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
