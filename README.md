# IoTDataStore
IoT adatok MongoDB adatbázisba rögzítését végző NodeJS alkalmazás.

## Telepítés
Az alkalmazás által használt csomagok telepítését az alábbi parancs kiadásával végezhetjük el:

```console
npm install
```

## Futtatás
Az alkalmazás működéséhez szükséges beállításokat a [config.js](config.js) fájl tartalmazza, 
amelyben az alapértelmezett értékek láthatóak.
Amennyiben más beállításokat szeretnénk használni, megtehetjük azt az adott környezeti változók definiálásával.

A program természeténél fogva egy MQTT brókert és egy [MongoDB](https://www.mongodb.com/) adatbázist igényel, amelyekhez csatlakozni tud.

### Docker image

> ### Figyelem!
> Az alábbi műveletek elvégzése előtt győződjünk meg arról, 
> hogy telepítve van-e a [Docker](https://www.docker.com/products/docker-desktop), 
> különben az alábbi műveletek nem fognak működni!

Lehetőség van az alkalmazás Docker konténerként történő futtatására. 
Ehhez adjuk ki az alábbi parancsokat a projekt gyökérkönyvtárában:

```console
docker build --tag=iot-datastore .
docker run iot-datastore
```

> Amennyiben szeretnénk az alapértelmezett beállításokat felülírni környezeti változókkal,
> ajánlott egy **connections.env** fájl létrehozása, ami a környezeti változókat definiálja,
> majd a ```docker run``` parancsot a ```--env-file connections.env``` kapcsolóval futtatni.
