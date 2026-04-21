# NextGIS Documentation Theme / Staging

Репозиторий содержит staging-версию документации NextGIS на базе Sphinx
с кастомизированной темой, шаблонами и frontend-ассетами.

## Назначение

- разработка и проверка нового оформления документации;
- локальная сборка Sphinx-документации;
- сборка CSS/JS-ассетов для главной и внутренних страниц;
- подготовка к публикации на Read the Docs.

## Структура проекта

```text
.
├── docs/
│   ├── source/              # исходники документации Sphinx
│   ├── src/                 # frontend-исходники (TS/SCSS) - только тут править кастомные стили и скрипты
│   ├── requirements.txt     # Python-зависимости
│   ├── package.json         # Node.js-зависимости и скрипты сборки
│   └── Makefile
├── .readthedocs.yaml
└── README.rst
```

## Локальная разработка

## Требования

- Python 3.10+
- Node.js 18+
- npm

## Установка зависимостей

```bash
python -m venv ./env
. ./env/bin/activate # Для Linux/MacOS пользователей
. ./env/Scripts/activate # Для Windows пользователей
cd docs
pip install -r requirements-dev.txt
npm install
```

## Основные команды

### Сборка frontend-ассетов

```bash
npm run build:assets
```

Команда собирает CSS/JS в каталог:

```text
source/_static/dist
```

### Сборка документации

```bash
npm run build:docs
```

Или напрямую через Sphinx:

```bash
sphinx-build -b html source build
```

### Полная сборка

```bash
npm run build
```

Эта команда последовательно:

1. собирает frontend-ассеты;
2. собирает HTML-документацию Sphinx.

### Очистка артефактов сборки

```bash
npm run clean
```

Команда удаляет:

- `source/_static/dist`
- `.parcel-cache`
- `build`

## Режим разработки

Для отслеживания изменений frontend-ассетов:

```bash
npm run dev
```

Если одновременно редактируются `.rst`-страницы и шаблоны Sphinx, удобно в отдельном
терминале запускать сборку с отслеживанием изменений:

```bash
sphinx-autobuild source build
```

## Переводы

```bash
pybabel compile --directory=source/locale --domain=messages
pybabel compile --directory=source/locale --domain=sphinx
```

## Что важно помнить

- Перед сборкой документации должны быть собраны ассеты из `src/`,
  потому что шаблоны и конфигурация ожидают файлы в `source/_static/dist/`.
- Каталог `build/` — результат сборки, его не нужно редактировать вручную.
- Каталог `source/_static/dist/` — артефакты frontend-сборки, их тоже не нужно править вручную.

## Публикация

Сборка на Read the Docs настраивается через файл:

```text
./.readthedocs.yaml
```

Для корректной публикации конфигурация Read the Docs должна учитывать не только
Python-зависимости, но и frontend-сборку ассетов перед запуском Sphinx.
