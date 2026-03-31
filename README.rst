NextGIS Documentation Theme / Staging
=====================================

Репозиторий содержит staging-версию документации NextGIS на базе Sphinx
с кастомизированной темой, шаблонами и frontend-ассетами.

Назначение
----------

- разработка и проверка нового оформления документации;
- локальная сборка Sphinx-документации;
- сборка CSS/JS-ассетов для главной и внутренних страниц;
- подготовка к публикации на Read the Docs.

Структура проекта
-----------------

::

   .
   ├── docs/
   │   ├── source/              # исходники документации Sphinx
   │   ├── src/                 # frontend-исходники (TS/SCSS)
   │   ├── requirements.txt     # Python-зависимости
   │   ├── package.json         # Node.js-зависимости и скрипты сборки
   │   └── Makefile
   ├── .readthedocs.yaml
   └── README.rst

Локальная разработка
--------------------

Требования:

- Python 3.10+
- Node.js 18+
- npm

Установка зависимостей:

.. code-block:: bash

   cd docs
   pip install -r requirements.txt
   npm install

Сборка ассетов:

.. code-block:: bash

   npm run build:assets

Сборка документации:

.. code-block:: bash

   npm run build:docs

Полная сборка:

.. code-block:: bash

   npm run build

Результат сборки будет находиться в каталоге:

.. code-block:: text

   docs/build/

Публикация
----------

Для сборки на Read the Docs используется конфигурация
``.readthedocs.yaml`` в корне репозитория.

