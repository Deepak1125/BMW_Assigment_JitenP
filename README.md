# Sonatype Nexus Docker Registry Setup on Windows (Docker Desktop)

## Overview

This guide explains how to:

- Run Sonatype Nexus Repository Manager 3 using Docker Desktop
- Configure Nexus as a private Docker Registry
- Expose Docker Registry port
- Login using Docker CLI
- Push Docker images
- Pull Docker images from Nexus

---

# Architecture

Final setup:

```text
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
```

---

# Prerequisites

Required:

- Windows 10/11
- Docker Desktop installed
- PowerShell
- Internet connection

Verify Docker installation:

```powershell
docker --version
```

Example:

```text
Docker version 28.x.x
```

---

# Step 1 — Pull Nexus Docker Image

Download the official Nexus image:

```powershell
docker pull sonatype/nexus3
```

Verify:

```powershell
docker images
```

Expected:

```text
REPOSITORY          TAG
sonatype/nexus3     latest
```

---

# Step 2 — Create Nexus Container

Create the Nexus container:

```powershell
docker run -d `
  --name nexus_local `
  -p 8086:8081 `
  -v nexus-data:/nexus-data `
  sonatype/nexus3
```

## Explanation

| Option | Purpose |
|---|---|
| `--name nexus_local` | Container name |
| `8086:8081` | Nexus UI port |
| `nexus-data` | Persistent storage |
| `/nexus-data` | Nexus data directory |

Check container:

```powershell
docker ps
```

Expected:

```text
0.0.0.0:8086->8081/tcp
```

---

# Step 3 — Access Nexus UI

Open browser:

```text
http://localhost:8086
```

Wait until Nexus finishes loading.

---

# Step 4 — Get Initial Admin Password

Run:

```powershell
docker exec nexus_local cat /nexus-data/admin.password
```

Example:

```text
xxxxxxxxxxxx
```

Login:

```text
Username:
admin

Password:
<password-from-file>
```

---

# Step 5 — Complete Nexus Setup

Complete:

- Change admin password
- Select anonymous access option
- Accept EULA

After login:

```text
Administration
    |
    └── Security
```

Verify admin user has:

```text
nx-admin
```

role.

---

# Step 6 — Create Docker Hosted Repository

Navigate:

```text
Administration
    |
    └── Repositories
            |
            └── Create repository
```

Select:

```text
docker (hosted)
```

Configure:

| Setting | Value |
|---|---|
| Name | docker-hub |
| HTTP | Enabled |
| HTTP Port | 8082 |
| Blob Store | default |
| Deployment Policy | Allow redeploy |

Click:

```text
Create repository
```

---

# Step 7 — Recreate Nexus Container With Docker Registry Port

Initially only UI is exposed:

```text
8086 -> 8081
```

Docker Registry requires:

```text
8082 -> 8082
```

Stop Nexus:

```powershell
docker stop nexus_local
```

Remove container:

```powershell
docker rm nexus_local
```

Check volume:

```powershell
docker volume ls
```

Example:

```text
nexus-data
```

Recreate container:

```powershell
docker run -d `
  --name nexus_local `
  -p 8086:8081 `
  -p 8082:8082 `
  -v nexus-data:/nexus-data `
  sonatype/nexus3
```

Verify:

```powershell
docker ps
```

Expected:

```text
0.0.0.0:8086->8081/tcp
0.0.0.0:8082->8082/tcp
```

---

# Step 8 — Verify Docker Registry API

Test registry:

```powershell
curl http://localhost:8082/v2/
```

Expected:

```json
{
  "errors": [
    {
      "code": "UNAUTHORIZED"
    }
  ]
}
```

This confirms the registry is running.

---

# Step 9 — Configure Docker Desktop Insecure Registry

Because Nexus uses HTTP, Docker must trust it.

Open:

```text
Docker Desktop
        |
        Settings
        |
        Docker Engine
```

Add:

```json
{
  "insecure-registries": [
    "localhost:8082"
  ]
}
```

Click:

```text
Apply & Restart
```

Verify:

```powershell
docker info
```

Expected:

```text
Insecure Registries:

localhost:8082
```

---

# Step 10 — Login To Nexus Docker Registry

Run:

```powershell
docker login localhost:8082
```

Enter:

```text
Username:
admin

Password:
your Nexus password
```

Expected:

```text
Login Succeeded
```

---

# Step 11 — Pull Test Image

Download image:

```powershell
docker pull hello-world
```

---

# Step 12 — Tag Image For Nexus

Docker image format:

```text
localhost:8082/<repository>/<image>:<tag>
```

Example:

```powershell
docker tag hello-world localhost:8082/docker-hub/hello-world:1.0
```

Verify:

```powershell
docker images
```

Expected:

```text
localhost:8082/docker-hub/hello-world
```

---

# Step 13 — Push Image To Nexus

Push:

```powershell
docker push localhost:8082/docker-hub/hello-world:1.0
```

Expected:

```text
1.0: digest: sha256:xxxxx
```

---

# Step 14 — Verify Image In Nexus UI

Open:

```text
http://localhost:8086
```

Navigate:

```text
Browse
 |
 └── docker-hub
        |
        └── hello-world
              |
              └── 1.0
```

---

# Step 15 — Test Pull From Nexus

Remove local image:

```powershell
docker rmi localhost:8082/docker-hub/hello-world:1.0
```

Pull again:

```powershell
docker pull localhost:8082/docker-hub/hello-world:1.0
```

Successful pull confirms the private registry works.

---

# Useful Commands

## View Nexus Logs

```powershell
docker logs -f nexus_local
```

---

## Check Container Ports

```powershell
docker port nexus_local
```

Expected:

```text
8081/tcp -> localhost:8086
8082/tcp -> localhost:8082
```

---

## Stop Nexus

```powershell
docker stop nexus_local
```

---

## Start Nexus

```powershell
docker start nexus_local
```

---

# Final Result

You now have:

```text
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
```

Working commands:

```powershell
docker login localhost:8082
```

```powershell
docker push localhost:8082/docker-hub/my-image:tag
```

```powershell
docker pull localhost:8082/docker-hub/my-image:tag
```

---

# Recommended GitHub Repository Structure

```text
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
```

---

# Conclusion

You now have a fully working private Docker Registry using:

- Windows
- Docker Desktop
- Sonatype Nexus Repository Manager 3
- Docker CLI

This setup can be used for:

- Private Docker image storage
- CI/CD pipelines
- Kubernetes image repositories
- DevOps practice environments
