"""Validate project preparation; no product gate or remote mutation."""
from pathlib import Path
import re
import runpy
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tmp/skill-validator-deps'))
try:
    import yaml
except ImportError:
    raise SystemExit('PyYAML required for validation; install in an isolated environment.')

profiles = yaml.safe_load((ROOT / 'agents/perfis.yaml').read_text(encoding='utf-8'))
assert profiles['max_concurrent_agents'] <= 4
assert profiles['kind'] == 'project-policy-not-native-config'
assert len(profiles['profiles']) == 10
assert len({p['id'] for p in profiles['profiles']}) == 10
allowed = {'gpt-6.1-sol': {'medium', 'high'}, 'gpt-6-luna': {'high'}}
skills = list((ROOT / '.agents/skills').glob('*/SKILL.md'))
assert len(skills) == 9
for p in profiles['profiles']:
    assert p['reasoning_effort'] in allowed[p['model']]
    assert p['max_children'] == 0
    assert (ROOT / p['prompt']).is_file()
    for name in p['skills']:
        assert (ROOT / '.agents/skills' / name / 'SKILL.md').is_file()

validator = Path.home() / '.codex/skills/.system/skill-creator/scripts/quick_validate.py'
assert validator.is_file(), 'Official skill validator not found'
for skill in sorted(skills):
    sys.argv = [str(validator), str(skill.parent)]
    print(skill.parent.name)
    try:
        runpy.run_path(str(validator), run_name='__main__')
    except SystemExit as result:
        if result.code not in (0, None):
            raise

tasks = (ROOT / 'docs/TAREFAS.md').read_text(encoding='utf-8')
ids = re.findall(r'^\| ((?:P0|GV|G[0-9])\.\d+) \|', tasks, re.M)
assert len(ids) == len(set(ids)) == 76
trace = (ROOT / 'docs/RASTREABILIDADE.md').read_text(encoding='utf-8')
assert len(re.findall(r'^\| A\d{2} \|', trace, re.M)) == 17
assert len(re.findall(r'^\| P\d \|', trace, re.M)) == 5
for file in (ROOT / 'docs').glob('*.md'):
    for link in re.findall(r'\]\(([^)]+\.md)\)', file.read_text(encoding='utf-8')):
        assert (file.parent / link).is_file(), (file, link)
assert (ROOT / 'AGENTS.md').is_file()
assert (ROOT / 'agents/templates/despacho.md').is_file()
print('PASS: 9 skills; 10 profiles; 76 unique tasks; 17 items; 5 pitch questions; document links valid.')
