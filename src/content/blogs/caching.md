---
title: "Caching with Redis "
date: "2026-10-27"
tags: ["System Design"]
excerpt: "Reducing latency on process heavy functions with Redis cache"
---

## Caching
Caching is the process of storing the data to from persistent storage (DB, or function call) to a temporary storage in CPU, allowing user to get the response faster.
So caching allows very fast response from an API call.

### Where is it sored ?
- CPU (Most common)-- Allows faster access, reduces latency on coputational heavy functions , DB, etc
- In-process Memory -- Stored in the memory of application, used for simple data. But wasted storage when using distributed servers as each apps have their own data.
- CDN -- Cache stored near the geographical location of user. Useful for static media files, for sites loading.
- Client-sider cache.

### Architecture
1. Cache-Aside (Solves most problems): This is the simplest and most used architecture and can solve most of the caching problems. In this when user calls an API, the cache storage is first checked for response and the original functional (DB, or other) is used as fallback.
2. Write-Through: 
3. Write-Behind: 
4. Read-Through: 
### Cache Eviction Policies

1. **Least Recently Used (LRU)** - Evict items that haven't been used recently. Most common and balanced default.
2. **Least Frequently Used (LFU)** - Evict items that are used least often, even if accessed recently. Good for highly skewed access patterns.
3. **First-In-First-Out (FIFO)** - Evict the oldest item first. Simple, but rarely the right choice.
4. **Time-To-Live (TTL)** - Each item expires after a set time (e.g., 5 minutes). Great for data that can go stale, like API responses.

## Implementation (useful for interviews)

Before implementing caching, first check is it even required or just is used for the sake of it. Few thinks to check before implementation.
- Is request is read heavy ? i.e. A lot of users are calling the same API so the load on DB is heavy
- Is it an expensive query ? i.e. The request requires a heavy computation like the recommendation based on user profile. You can just store the query and the computation result in cache.
- High database CPU
- Do you need to have a sub minimum latency requirement for a request ? e.g. Need low latency

After you have decided that caching is required, decide the key features.
- What is the bottleneck for the caching ?
- What data (key, value) to cache  ? e.g. In case of expensive query, query and result is cached. 
- What architecture is best ? e.g. Cache-aside solves most problem
- Set the Eviction policy. e.g. TTL should be added to all, LRU is most used. (Both are used simultanesely).

### Basic demo of caching

**Initial Setup**
```python
## docker run -d -p 6379:6379 redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

```

```python
def caching(num: int):
    out = None
    prev = time.time()
    try:
        out = r.get(num)
    except Exception as e:
        print("Redis not runnning, Error", e)

    if not out:
        out = json.dumps(primes_below(num))
        r.set(num, out, ex=TTL_SECONDS) ## TTL is already added here
    latency = time.time() - prev
    return out, latency
```

**For LRU** : 
This is for direct configuring of Redis, we can also create a docker volume for Redis and specify these details of max-memory or create custom Redis configuration file.

```shell
docker exec -it <container> redis-cli CONFIG SET maxmemory 256mb
docker exec -it <container> redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

```shell
docker exec -it 3150c773c4e4 redis-cli CONFIG SET maxmemory 256mb
docker exec -it 3150c773c4e4 redis-cli CONFIG SET maxmemory-policy allkeys-lru

## verify
docker exec -it 3150c773c4e4 redis-cli INFO memory | grep -E "maxmemory|used_memory_human"
used_memory_human:1.47M
maxmemory:268435456
maxmemory_human:256.00M
maxmemory_policy:allkeys-lru
```

## References

[Hello Interview - Caching](https://www.youtube.com/watch?v=1NngTUYPdpI)