Below is a complete start-to-finish GitHub documentation guide for setting up Sonatype Nexus Repository Manager 3 as a private Docker Registry on Windows using Docker Desktop.

You can copy this directly into a README.md.

Sonatype Nexus Docker Registry Setup on Windows (Docker Desktop)
Overview

This guide explains how to:

Run Sonatype Nexus Repository Manager 3 using Docker Desktop
Configure Nexus as a private Docker Registry
Expose Docker Registry port
Login using Docker CLI
Push Docker images
Pull Docker images from Nexus
Architecture

Final setup:

Windows Host
│
├── Nexus UI/API
│       http://localhost:8086
│       |
│       └── Container Port 8081
│
└── Docker Registry
        localhost:8082
        |
        └── Container Port 8082

Prerequisites

Required:

Windows 10/11
Docker Desktop installed
PowerShell
Internet connection

Verify Docker:

docker --version


Example:

Docker version 28.x.x

Step 1 — Pull Nexus Docker Image

Download the official Nexus image:

docker pull sonatype/nexus3


Verify:

docker images


Expected:

REPOSITORY          TAG
sonatype/nexus3     latest

Step 2 — Create Nexus Container

Create a container:

docker run -d `
  --name nexus_local `
  -p 8086:8081 `
  -v nexus-data:/nexus-data `
  sonatype/nexus3


Explanation:

Option	Purpose
--name nexus_local	Container name
8086:8081	Nexus UI port
nexus-data	Persistent storage
/nexus-data	Nexus data directory

Check:

docker ps


Expected:

0.0.0.0:8086->8081/tcp

Step 3 — Access Nexus UI

Open:

http://localhost:8086


Wait until Nexus loads.

Step 4 — Get Initial Admin Password

Run:

docker exec nexus_local cat /nexus-data/admin.password


Example output:

xxxxxxxxxxxx


Login:

Username:
admin

Password:
<password-from-file>

Step 5 — Complete Nexus Setup

Complete:

Password change
Anonymous access choice
EULA acceptance

After login:

Administration
   |
   └── Security


Verify admin user has:

nx-admin


role.

Step 6 — Create Docker Hosted Repository

Navigate:

Administration
   |
   └── Repositories
        |
        └── Create repository


Select:

docker (hosted)


Configure:

Setting	Value
Name	docker-hub
HTTP	Enabled
HTTP Port	8082
Blob Store	default
Deployment Policy	Allow redeploy

Click:

Create repository

Step 7 — Recreate Nexus Container With Docker Registry Port

Initially only UI is exposed:

8086 -> 8081


Docker Registry requires:

8082 -> 8082


Stop container:

docker stop nexus_local


Remove container:

docker rm nexus_local


Check volume:

docker volume ls


Example:

nexus-data


Recreate:

docker run -d `
  --name nexus_local `
  -p 8086:8081 `
  -p 8082:8082 `
  -v nexus-data:/nexus-data `
  sonatype/nexus3


Verify:

docker ps


Expected:

0.0.0.0:8086->8081/tcp
0.0.0.0:8082->8082/tcp

Step 8 — Verify Docker Registry API

Test:

curl http://localhost:8082/v2/


Expected:

{
"errors":[
 {
  "code":"UNAUTHORIZED"
 }
]
}


This confirms the registry is running.

Step 9 — Configure Docker Desktop Insecure Registry

Because Nexus is using HTTP, Docker must trust it.

Open:

Docker Desktop
        |
        Settings
        |
        Docker Engine


Add:

{
  "insecure-registries": [
    "localhost:8082"
  ]
}


Apply and restart Docker Desktop.

Verify:

docker info


Expected:

Insecure Registries:

localhost:8082

Step 10 — Login to Nexus Registry

Run:

docker login localhost:8082


Enter:

Username:
admin

Password:
your Nexus password


Expected:

Login Succeeded

Step 11 — Pull Test Image

Download image:

docker pull hello-world

Step 12 — Tag Image For Nexus

Format:

localhost:8082/<repository>/<image>:<tag>


Example:

docker tag hello-world localhost:8082/docker-hub/hello-world:1.0


Verify:

docker images


Expected:

localhost:8082/docker-hub/hello-world

Step 13 — Push Image To Nexus

Push:

docker push localhost:8082/docker-hub/hello-world:1.0


Expected:

1.0: digest: sha256:xxxxx

Step 14 — Verify In Nexus UI

Open:

http://localhost:8086


Navigate:

Browse
 |
 └── docker-hub
        |
        └── hello-world
              |
              └── 1.0

Step 15 — Test Pull From Nexus

Remove local copy:

docker rmi localhost:8082/docker-hub/hello-world:1.0


Pull again:

docker pull localhost:8082/docker-hub/hello-world:1.0


Successful pull confirms the private registry works.

Useful Commands
View Nexus logs
docker logs -f nexus_local

Check container ports
docker port nexus_local


Expected:

8081/tcp -> localhost:8086
8082/tcp -> localhost:8082

Stop Nexus
docker stop nexus_local

Start Nexus
docker start nexus_local

Final Result

You now have:

Docker Client
      |
      |
 localhost:8082
      |
      |
 Nexus Docker Hosted Repository
      |
      |
 Docker Images


Working commands:

docker login localhost:8082

docker push localhost:8082/docker-hub/my-image:tag

docker pull localhost:8082/docker-hub/my-image:tag

Recommended Repository Structure for GitHub
nexus-docker-registry/
│
├── README.md
│
├── screenshots/
│   ├── nexus-login.png
│   ├── docker-hosted-repo.png
│   └── docker-push.png
│
└── commands/
    └── nexus-docker-commands.md


This will make a clean portfolio-quality documentation project.
