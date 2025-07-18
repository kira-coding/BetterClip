use tauri::{self, Manager};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
pub mod database;
pub mod tray_setup;
use crate::tray_setup::setup_tray;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_sql::{Migration, MigrationKind};
// L`earn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!(" {}", name)
}
#[tauri::command]
fn search(query: &str) -> String {
    format!("{}", query)
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let ctrl_n_shortcut = Shortcut::new(Some(Modifiers::SUPER), Code::Backquote);
    tauri::Builder::default()
        
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(move |app| {
            setup_tray(app)?;
            if let Some(window) = app.get_webview_window("main") {
                window.hide().unwrap()
            }
            app.global_shortcut().register(ctrl_n_shortcut)?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(move |app, shortcut, event| {
                    println!("{:?}", shortcut);
                    if shortcut == &ctrl_n_shortcut {
                        match event.state() {
                            ShortcutState::Pressed => {
                                if let Some(window) = app.get_webview_window("main") {
                                    if let Ok(open) = window.is_visible() {
                                        if open == true {
                                            window.hide().unwrap();
                                        } else {
                                            window.show().unwrap();
                                        }
                                    }
                                }
                            }
                            ShortcutState::Released => {
                                println!("released")
                            }
                        }
                    }
                })
                .build(),
        )
        .plugin(tauri_plugin_clipboard_x::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(
                    "sqlite:betterClip1.db",
                    vec![
                        // Define your migrations here
                        Migration {
                            version: 1,
                            description: "create_initial_tables",
                            sql: include_str!("../../migrations/1_create_tables.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 2,
                            description: "delete width",
                            sql: include_str!("../../migrations/2_delete_width.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 3,
                            description: "delete height",
                            sql: include_str!("../../migrations/3_delete_height.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 4,
                            description: "remove types",
                            sql: include_str!("../../migrations/4_remove_type.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 5,
                            description: "add file to types",
                            sql: include_str!("../../migrations/5_add_file_type.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 6,
                            description: "add pin",
                            sql: include_str!("../../migrations/6_pid.sql"),
                            kind: MigrationKind::Up,
                        },
                    ],
                )
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet, search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
