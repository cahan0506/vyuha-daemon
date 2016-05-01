## Welcome

Vyuha is a service that makes deploying projects as easy as possible. It is a daemon process that checks a directory (called the landing zone) for changes. Once a change is detected, the added file is checked for format (zip), unzipped, added to an output directory.

This is the general idea:
```
  LandingZone/
    | Watch process |
      << File Add Detected >>
      - Check file type
      - Is zip file?
        NO  ->  Throw error
                Shutdown
        YES ->  Unzip to output directory
                Run Vyuhafile
```

### Vyuhafile

The `Vyuhafile` is a command-configuration file for the Vyuha daemon. One can define tasks (usually shell commands) to be run after the project directory is unarchived. A sample Vyuhafile could look like this:
```
# Vyuhafile
# ------------
# These are comments

TASKNAME:
  echo 'Hello'

TASKNAME;
```

Sample `Vyuhafile`s can be found in the examples directory of this repo.

### CLI

The command line interface allows shell access to vyuha functionality.
```
vyuha -d          # Runs Vyuha as a daemon process
      -v          # Verbose output
      <taskname>  # Runs task defined in Vyuhafile
```
