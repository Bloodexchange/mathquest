# Настройка авторизации
Изменения подготовлены локально. Перед публикацией настройте серверные переменные:
- GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET: OAuth Web application в Google Cloud; redirect URI https://ВАШ-ДОМЕН/api/auth/callback/google.
- APPLE_CLIENT_ID и APPLE_CLIENT_SECRET: Services ID и подписанный Apple client secret; redirect URI https://ВАШ-ДОМЕН/api/auth/callback/apple. Следите за сроком действия секрета.
- Сохраните DATABASE_URL, BETTER_AUTH_SECRET и BETTER_AUTH_URL (адрес сайта).
Не добавляйте секреты в public или Git.

Регистрация и вход работают по email и паролю без отправки кода и без подтверждения почты. Почтовый сервис не требуется. Проверяется формат email, но не владение адресом.

Google и Apple требуют указанные выше OAuth-настройки. Проверка после настройки: регистрация, повторный вход, выход, вход через Google/Apple.
