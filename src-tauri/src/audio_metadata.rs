use lofty::prelude::{AudioFile, ItemKey, TaggedFileExt};
use serde::{Deserialize, Serialize};
use std::path::Path;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct AudioMetadata {
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: u64,
    pub full_path: String,
}

#[command]
pub fn get_audio_metadata(full_path: String) -> Result<AudioMetadata, String> {
    let path = Path::new(&full_path);

    // 读取音频文件
    let tagged_file = match lofty::read_from_path(path) {
        Ok(file) => file,
        Err(e) => return Err(format!("无法读取音频文件: {}", e)),
    };

    // 获取音频属性
    let properties = tagged_file.properties();

    // 尝试获取标签信息
    let tag = match tagged_file.primary_tag() {
        Some(tag) => tag,
        None => match tagged_file.first_tag() {
            Some(tag) => tag,
            None => {
                // 如果没有标签，使用文件名作为标题
                let filename = path
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or("")
                    .to_string();

                // 确保正确返回Result类型
                return Ok(AudioMetadata {
                    title: filename,
                    artist: "未知艺术家".to_string(),
                    album: "未知专辑".to_string(),
                    duration: properties.duration().as_secs(),
                    full_path: full_path.clone(),
                });
            }
        },
    };

    // 提取标签信息 - 修复闭包参数问题
    let title = match tag.get_string(&ItemKey::TrackTitle) {
        Some(title) => title.to_string(),
        None => path
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("未知标题")
            .to_string(),
    };

    let artist = match tag.get_string(&ItemKey::TrackArtists) {
        Some(artist) => artist.to_string(),
        None => "未知艺术家".to_string(),
    };

    let album = match tag.get_string(&ItemKey::AlbumTitle) {
        Some(album) => album.to_string(),
        None => "未知专辑".to_string(),
    };

    // 确保正确返回Result类型
    Ok(AudioMetadata {
        title,
        artist,
        album,
        duration: properties.duration().as_secs(),
        full_path,
    })
}
