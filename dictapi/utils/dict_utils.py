from heritage import HeritagePlatform
Heritage = HeritagePlatform('', method='web')

def extract_roots(data):
  roots = set()
  for sentence_data in data.values():
    for word_list in sentence_data["words"]:
      for word_info in word_list:
        roots.add(word_info["root"])
  return list(roots)

def get_roots(query):
  analyses = Heritage.get_analysis(query)
  roots = extract_roots(analyses)
  return roots