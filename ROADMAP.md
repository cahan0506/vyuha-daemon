## Roadmap

Vyuha is meant to be run as a daemon process. To use, install it globally:
```
npm install vyuha -g
vyuha -d
```

### Daemon
The `-d` command runs Vyuha as a daemon process. When complete, the daemon will create a `~/.vyuha/` directory with a config file. This config contains the path for the landing zone (watched directory) and the output directory. Any projects handled by the daemon will be placed here.

Before a project is added to the output directory, it is checked for duplicate. If the project already exists it will be replaced.

### Client
The Vyuha-client packages and sends projects to the host machine running the Vyuha-daemon.

The Vyuha cli will let you run any task that is defined in the `Vyuhafile`. All you have to do is run:
```
vyuha <taskname>
```

There are a couple of builtin tasks:
```
ENV     # Changes runtime environment
REPORT  # Sends data to monitoring service
```

### Monitor
At each step of the deployment process, the Vyuha-daemon will send reports to the monitoring service. You can specify this data by using the `REPORT` task.

To check the output of the reporting service, read the `vyuha.log` file located at the path specified in the config file.
