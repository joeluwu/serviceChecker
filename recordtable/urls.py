from django.conf.urls import include, url
from django.conf import settings
from recordtable import views

urlpatterns = [
    url(r'^records/$', views.RecordList.as_view()),
]
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
