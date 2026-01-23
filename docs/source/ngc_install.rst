
.. _ng_connect_install:

Установка
=========

Для загрузки модуля NextGIS Connect перейдите в меню настройки модулей из главной панели: *Модули ‣ Управление модулями*. Начните набирать в поиске название модуля, выберите его в списке и нажмите кнопку **Установить модуль**.

В ПО `NextGIS QGIS <http://nextgis.ru/nextgis-qgis/>`_ модуль NextGIS Connect включен в поставку, вы можете сразу начинать работу.

При необходимости проверить/обновить версию модуля можно в разделе меню *Модули ‣ Управление модулями ‣ NextGIS Connect*. 

.. raw:: html

   <iframe width="560" height="315" src="https://rutube.ru/play/embed/5f96ea9ca914a0a06cf365e6330c16b2/" frameBorder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

Посмотреть видео на `youtube <https://youtu.be/6UX0_Bn2L-A>`_, `rutube <https://rutube.ru/video/5f96ea9ca914a0a06cf365e6330c16b2/>`_.

После установки модуля на панели инструментов появится иконка: 

.. figure:: _static/logo_connect.png
   :align: center
   :alt: Иконка модуля расширения NextGIS Connect.

При нажатии на иконку откроется панель управления ресурсами Веб ГИС. `Подробнее о панели NextGIS Connect <https://docs.nextgis.ru/docs_ngconnect/source/panel.html>`_.

.. figure:: _static/connect_panel_ru_2.png
   :align: center
   :alt: Панель модуля расширения NextGIS Connect
   :width: 10cm
   
   Панель модуля расширения NextGIS Connect

Для начала работы `создайте подключение к Веб ГИС <https://docs.nextgis.ru/docs_ngconnect/source/ngc_install.html#ng-connect-new-connection>`_. 

.. _ng_connect_new_connection:

Создание подключения
--------------------

1. Нажмите кнопку |button_settings| Настройки на панели модуля расширения NextGIS Connect.

.. |button_settings| image:: _static/button_settings.png
   :width: 6mm
   :alt: синяя шестерёнка

.. figure:: _static/nextgis_connect/call_settings_ru.png
   :align: center
   :alt: Вызов диалога настроек
   :width: 10cm

   Вызов диалога настроек

2. В открывшемся окне нажмите кнопку **Новое** и заполните поля:

* URL - адрес интересующей вас Веб ГИС.
* Название - идентификатор подключения для быстрого поиска в списке подключений.

.. figure:: _static/nextgis_connect/create_connection_ru.png
   :align: center
   :width: 24cm
   :name: create_connection_pic
   :alt: Добавление соединения
   
   Добавление соединения

Если вы создали свою Веб ГИС, ее адрес вы можете узнать на странице: https://my.nextgis.com/webgis

.. figure:: _static/nextgis_connect/my_nextgis.png
   :align: center
   :alt: Адрес Веб ГИС
   :width: 20cm
   
   Адрес Веб ГИС

3. В разделе "Аутентификация" добавьте новую конфигурацию или выберите из существующих (в списке отражается название соединения и имя пользователя, а также тип аутентификации).

Можно подключиться "как гость", если нет необходимости выполнять действия, правами на которые не обладает неавторизованный пользователь. Для этого оставьте значение по умолчанию "Без аутентификации".

.. note:: 
   Создавать и удалять ресурсы Веб ГИС может ее владелец и пользователи, добавленные в `команду <https://docs.nextgis.ru/docs_ngcom/source/create.html#ngcom-team-management>`_.

Для того, чтобы **добавить новую конфигурацию**, нажмите кнопку с зеленым плюсом.

Откроется диалоговое окно "Аутентификация".

.. figure:: _static/auth_config_create_ru_2.png
   :align: center
   :width: 12cm
   :name: auth_config_create_pic
   :alt: Добавление конфигурации аутентификации
   
   Добавление конфигурации аутентификации

* Заполните поля *Логин* и *Пароль* данными вашего NextGIS ID;
* Нажмите **Сохранить**.

Убедитесь, что выбрана нужная конфигурация. Если хотите проверить правильность введенных данных, нажмите **Проверка подключения**. 

Если у гостя или пользователя, под которым вы пытаетесь зайти, недостаточно прав для доступа хотя бы к Основной группе ресурсов, появится сообщение об ошибке. В таком случае вам нужно авторизоваться под пользователем, имеющем такие права, или обратиться к администратору Веб ГИС, чтобы получить соответствующие права.

.. to do:: _static/ngc_permission_error_ru.png
   :name: auth_config_create_pic
   :align: center
   :width: 12cm


4. Нажмите **Сохранить** в окне "Создание подключения" (:numref:`create_connection_pic`) и затем кнопку **ОК**. 

Подключение, выбранное в выпадающем списке "Соединения" диалога "Настройки" станет активным **после закрытия** диалога.

В окне модуля появится дерево ресурсов вашей Веб ГИС. 

   
.. figure:: _static/NGConnection_result_ru.png
   :name: NGconnection_result_pic
   :align: center
   :width: 20cm
   
   Дерево ресурсов подключенной Веб ГИС в окне NextGIS Connect

Теперь можно приступить к `обмену данными <https://docs.nextgis.ru/docs_ngconnect/source/ngc_data_transfer.html>`_.



Keycloak-аутентификация в NextGIS QGIS
----------------------------------------

Настольная NextGIS QGIS, Веб ГИС NextGIS Web и NextGIS Connect – связующее звено между настольной и Веб ГИС – работают с геоинформационными системами, в которых авторизация происходит через Keycloak. 

Это актуально для корпоративных пользователей с Веб ГИС, развёрнутой `на своём сервере <https://nextgis.ru/pricing/>`_.
