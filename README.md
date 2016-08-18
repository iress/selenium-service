
# selenium-service

Install Selenium as a native Linux or Windows service.

### Usage

Install the package:

```
npm i -g selenium-service
```

To install the services:

```
selenium-service --add
```

To uninstall the services:

```
selenium-service --remove
```

To start a service:
 
```
selenium-service --run [node|hub|server]
```

For Selenium Grid hubs, the environment variable `SELENIUM_SERVICE_HUB_JSON` will be passed to selenium as `-hubConfig`

