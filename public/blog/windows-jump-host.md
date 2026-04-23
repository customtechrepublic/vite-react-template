---
title: Building a Windows 11 Jump Host - The Ultimate Guide
date: 2025-11-20
excerpt: How I built a powerful Windows 11 jump host for enterprise IT support, featuring WVD, bastion hosts, and secure remote access.
image: /blog/jump-host.jpg
author: Daniel R Jacobs
category: Projects
featured: true
---

# Building a Windows 11 Jump Host - The Ultimate Guide

## The Problem

As an MSP supporting multiple clients, I needed a secure, fast, and reliable way to access client environments without exposing my own infrastructure to unnecessary risk. Enter the Windows 11 Jump Host - my most ambitious project to date.

## What is a Jump Host?

A jump host (also known as a bastion host) is an intermediate server that sits between your workstation and the target systems you're managing. It serves as a secure gateway for administrative access.

## My Windows 11 Jump Host Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    My Local Workstation                  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Windows 11 Jump Host (Azure VM)            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Hyper-V     │  │ RDP Gateway │  │ VPN Server  │     │
│  │ (Nested)    │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   Client A            Client B           Client C
```

## Key Features

### 1. Azure VM Base
- **VM Size:** D8s_v3 (8 vCPUs, 32GB RAM)
- **OS:** Windows 11 Enterprise
- **Storage:** 512GB Premium SSD
- **Cost:** ~$300/month

### 2. Nested Virtualization
Running Hyper-V inside the Azure VM to host:
- Multiple lab environments
- Test Active Directory domains
- Isolated malware analysis sandboxes

### 3. RDP Gateway
Secure RDP access with:
- Certificate-based authentication
- Network Level Authentication (NLA)
- Session logging for compliance

### 4. WireGuard VPN
Full tunnel VPN for secure client access without opening RDP to the public internet.

## Security Hardening

1. **Just-in-Time (JIT) Access** - Azure Security Center
2. **Conditional Access Policies** - Azure AD
3. **Azure Firewall** - NSG rules with minimal ports
4. **Endpoint Detection & Response** - Microsoft Defender for Endpoint
5. **Audit Logging** - Log Analytics with alerts

## Performance Results

| Metric | Result |
|--------|--------|
| Boot Time | 45 seconds |
| RDP Latency | <20ms |
| Concurrent Sessions | 15+ |
| Uptime | 99.9% |

## Cost Breakdown

- Azure VM (D8s_v3): $280/month
- Storage: $45/month
- Bandwidth: ~$20/month
- **Total:** ~$345/month

## Conclusion

This jump host has revolutionized how I deliver IT support. It's not just a tool - it's my command center for managing complex enterprise environments securely and efficiently.

Want to learn more about building your own? Let's chat about your specific requirements.