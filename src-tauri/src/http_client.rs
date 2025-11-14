use std::result::Result;

/// 发送HTTP GET请求
/// * `url` - 完整的请求URL
/// * `header` - 请求头列表，从这个参数获取所有请求头
/// * `query` - 查询参数列表
pub async fn http_get(
    url: &str,
    header: Vec<(&str, &str)>,
    query: Vec<(&str, &str)>,
) -> Result<String, String> {
    // 创建HTTP客户端
    let client = reqwest::Client::new();
    // 创建请求
    let mut request = client.get(url).query(&query);
    // 只从参数header中获取请求头，不再设置默认请求头
    for (key, value) in header {
        request = request.header(key, value);
    }
    // 发送请求
    match request.send().await {
        Ok(response) => {
            // 检查响应状态
            if response.status().is_success() {
                match response.text().await {
                    Ok(text) => Ok(text),
                    Err(e) => Err(format!("读取响应失败: {}", e)),
                }
            } else {
                Err(format!("请求失败，状态码: {}", response.status()))
            }
        }
        Err(e) => Err(format!("发送请求失败: {}", e)),
    }
}

/// 辅助函数：处理JSONP响应
pub fn parse_jsonp(jsonp_str: &str) -> Result<String, String> {
    // 查找JSON数据的开始位置
    if let Some(start_idx) = jsonp_str.find('(') {
        if let Some(end_idx) = jsonp_str.rfind(')') {
            if end_idx > start_idx {
                let json_str = &jsonp_str[start_idx + 1..end_idx];
                return Ok(json_str.to_string());
            }
        }
    }
    Err("无效的JSONP格式".to_string())
}
