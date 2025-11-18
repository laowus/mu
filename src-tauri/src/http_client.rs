use serde_json::Value;
use std::collections::HashMap;
use std::result::Result;

#[tauri::command]
pub async fn http_get_json(
    url: &str,
    header: HashMap<String, String>,
    req_body: HashMap<String, Value>, // 修改为接受Value类型
) -> Result<Value, String> {
    // 创建HTTP客户端
    let client = reqwest::Client::new();
    // 创建请求
    let mut request = client.get(url);

    // 添加查询参数 - 将Value转换为字符串
    for (key, value) in &req_body {
        // 将任何类型的值转换为字符串
        let value_str = match value {
            Value::String(s) => s.to_string(),
            Value::Number(n) => n.to_string(),
            Value::Bool(b) => b.to_string(),
            _ => value.to_string(), // 对于其他类型，使用JSON字符串表示
        };
        request = request.query(&[(key, value_str)]);
    }

    // 添加请求头
    for (key, value) in header {
        request = request.header(key, value);
    }

    // 发送请求
    match request.send().await {
        Ok(response) => {
            // 检查响应状态
            if response.status().is_success() {
                // 使用text_with_charset确保中文正确显示
                match response.text_with_charset("utf-8").await {
                    Ok(text) => {
                        // 尝试将文本解析为JSON
                        match serde_json::from_str::<Value>(&text) {
                            Ok(json) => Ok(json),
                            Err(e) => {
                                eprintln!("JSON解析失败: {}", e);
                                Err(format!("JSON解析失败: {}", e))
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("读取响应失败: {}", e);
                        Err(format!("读取响应失败: {}", e))
                    }
                }
            } else {
                Err(format!("请求失败，状态码: {}", response.status()))
            }
        }
        Err(e) => {
            eprintln!("发送请求失败: {}", e);
            Err(format!("发送请求失败: {}", e))
        }
    }
}
