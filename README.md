# VBsal

Календарь смен и заработка банщика. Одно веб-приложение (`www/`), которое работает как
PWA на iPhone (через GitHub Pages) и как APK на Android (через Capacitor).

## Структура

| Путь | Что это |
|---|---|
| `www/` | Само приложение: `index.html`, `app.js`, `styles.css`, `sw.js`, иконки. Это и загружается на GitHub Pages |
| `android/` | Android-проект Capacitor (генерируется, правится редко) |
| `build-apk.ps1` | Сборка `VBsal.apk` |
| `keystore/` | Ключ подписи APK. **Сделайте резервную копию!** Без него обновления не встанут поверх старой версии |
| `D:\VBSal-tools\` | JDK 21 и Android SDK для сборки (вне проекта) |

Формула дня: `ставка (если отмечена «Смена») + (сумма процедур × 0,4) / банщиков`,
«второе дыхание» прибавляет 500 ₽ к цене процедуры. Данные хранятся на телефоне (localStorage).

## Android: собрать APK

```powershell
.\build-apk.ps1
```

Готовый файл — `D:\VBSal\VBsal.apk`. Его можно отправить в Telegram/WhatsApp; при установке
Android попросит разрешить установку из этого источника. Перед новой сборкой увеличьте
`versionCode` и `versionName` в `android/app/build.gradle`.

## iPhone: GitHub Pages

Репозиторий: https://github.com/claimsss/VBSal, сайт: https://claimsss.github.io/VBSal/

Публикация автоматическая: при каждом `git push` в `main` с изменениями в `www/`
GitHub Actions (`.github/workflows/pages.yml`) выкладывает папку `www` на Pages.
В **Settings → Pages** источник должен быть **GitHub Actions**.

Установка: открыть ссылку на iPhone **в Safari** → «Поделиться» → **«На экран „Домой“»**.
Приложение на телефоне подхватит новую версию при следующем запуске (иногда нужен второй
перезапуск). Сохранённые смены при обновлении не теряются — они живут в localStorage
телефона. Не удаляйте иконку с экрана «Домой»: вместе с ней iOS удаляет и данные.
