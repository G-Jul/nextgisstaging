# Документация NextGIS: локальная разработка и сборка

Этот каталог содержит исходники документации на Sphinx и frontend-ассеты,
которые используются шаблонами документации.

## Что находится в каталоге

```text
docs/
├── source/              # исходники Sphinx (rst, шаблоны, _static)
├── src/                 # исходники frontend-ассетов (TS/SCSS)
├── build/               # результат локальной сборки документации
├── requirements.txt     # Python-зависимости
├── package.json         # Node.js-зависимости и npm-скрипты
├── Makefile
└── make.bat
```

## Требования

Для локальной разработки нужны:

- Python 3.10+
- Node.js 18+
- npm

## Установка зависимостей

```bash
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
```

## Сборка через Makefile

Для Linux/macOS можно использовать команды:

```bash
make init
make assets
make html
make clean
```

Где:

- `make init` — установка Python- и Node-зависимостей;
- `make assets` — сборка frontend-ассетов;
- `make html` — сборка HTML-документации;
- `make clean` — очистка артефактов.

## Что важно помнить

- Перед сборкой документации должны быть собраны ассеты из `src/`,
  потому что шаблоны и конфигурация ожидают файлы в `source/_static/dist/`.
- Каталог `build/` — результат сборки, его не нужно редактировать вручную.
- Каталог `source/_static/dist/` — артефакты frontend-сборки, их тоже не нужно править вручную.

## Публикация

Сборка на Read the Docs настраивается через файл:

```text
../.readthedocs.yaml
```

Для корректной публикации конфигурация Read the Docs должна учитывать не только
Python-зависимости, но и frontend-сборку ассетов перед запуском Sphinx.
