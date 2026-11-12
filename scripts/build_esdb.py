#!/usr/bin/env python3
"""Build the ESDB Size 70, Level 4 game word list. Python stdlib only."""
from pathlib import Path
import hashlib, json, re, sys, zipfile
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'vendor/esdb-level4/source.zip'
assert SRC.exists(), 'Missing bundled ESDB source archive'
with zipfile.ZipFile(SRC) as z:
    source=z.read('words.txt').decode('utf-8-sig').splitlines()
    readme=z.read('README').decode('utf-8')
assert 'Size: 70' in readme and 'Variant Level: 4' in readme, 'Unexpected ESDB source settings'
valid=re.compile(r'[a-z]{3,20}\Z')
base={word for word in source if valid.fullmatch(word)}
def list_file(name):
    return {w.strip() for w in (ROOT/'data'/name).read_text(encoding='utf-8').splitlines() if w.strip() and not w.startswith('#')}
added=list_file('dictionary_supplements.txt'); excluded=list_file('dictionary_exclusions.txt')
assert all(valid.fullmatch(w) for w in added|excluded)
assert not added & excluded
words=sorted((base|added)-excluded)
# The export includes only certain sources; manually reviewed content restrictions remain a limited set.
word_json=json.dumps(words,ensure_ascii=False,separators=(',',':'))
(ROOT/'data/dictionary.json').write_text(word_json+'\n',encoding='utf-8')
manifest={
 'version':'esdb-70-level4-ga-v1', 'source':'English Speller Database, 24 June 2026 revision',
 'source_sha256':hashlib.sha256(SRC.read_bytes()).hexdigest(),
 'source_entries':len(source), 'base_eligible':len(base),
 'supplements':sorted(added), 'exclusions':sorted(excluded), 'word_count':len(words),
 'dictionary_sha256':hashlib.sha256((word_json+'\n').encode()).hexdigest(),
 'filters':'Lowercase ASCII A-Z, 3–20 characters; manual supplements/exclusions',
 'limitations':'Not a comprehensive offensive-vocabulary audit; the full lexicon has not been individually adjudicated.'
}
(ROOT/'data/dictionary_manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps(manifest,indent=2))
