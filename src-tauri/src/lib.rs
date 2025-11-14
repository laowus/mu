mod http_client;
mod qq;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 注册命令
        .invoke_handler(tauri::generate_handler![qq::fetch_qq_category])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
