#!/usr/bin/env python3
"""Check portable n8n templates; no network or credentials required."""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
for path in sorted((root / 'workflows').glob('*.json')):
    data = json.loads(path.read_text())
    assert data['active'] is False, path
    nodes = data['nodes']
    names = {n['name'] for n in nodes}
    assert len(names) == len(nodes), path
    assert len({n['id'] for n in nodes}) == len(nodes), path
    assert all('credentials' not in n and 'webhookId' not in n for n in nodes), path
    linked = set()
    for source, outputs in data['connections'].items():
        assert source in names, source
        for groups in outputs.values():
            for group in groups:
                for connection in group:
                    assert connection['node'] in names, connection
                    linked.update((source, connection['node']))
    assert all(n['name'] in linked or n['type'].endswith('.stickyNote') for n in nodes), path
    print(f'OK {path.name}: {len(nodes)} nodes, no dangling references or credential bindings')
