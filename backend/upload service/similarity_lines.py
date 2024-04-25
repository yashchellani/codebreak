import utils

def find_lines(file1, file2, slices) -> tuple:
    #f1 is the main file
    #f2 is the reference file
    f1starts, f1ends = create_line_mapping(file1)
    f2starts, f2ends = create_line_mapping(file2)

    f1Chars = slices[0]
    f2Chars = slices[1]

    if len(f1starts) == 0 or len(f2starts) == 0 or len(f1Chars) == 0 or len(f2Chars) == 0:
        return "0", "0"

    f1Lines = get_line_numbers(f1starts, f1ends,f1Chars[0], f1Chars[1])
    f2Lines = get_line_numbers(f2starts, f2ends,f2Chars[0], f2Chars[1])

    #mark file 2 for deletion
    utils.all_files[file2] = True
    return f1Lines, f2Lines



def find_nearest_key(keyset: set, key: int) -> int:
    for i in range(key, key-200, -1):
        if i in keyset:
            return i
    for i in range(key, key+200, 1):
        if i in keyset:
            return i


def create_line_mapping(file) -> tuple:
    startsMap = {}
    endsMap = {}
    try:
        f = open(file, "r")
        lineCounter = 0
        startOffset = 0

        for line in f:
            lineCounter += 1
            line = line.strip("\n")
            line = line.strip("\r")
            startsMap[startOffset] = lineCounter
            endsMap[startOffset + len(line)] = lineCounter
            startOffset += len(line) + 1
        f.close()
    except Exception as e:
        print(e)
        return startsMap, endsMap
    
    return startsMap, endsMap


def get_line_numbers(starts: dict, ends: dict, startSlices: list, endSlices: list) -> str:
    lines = set()
    try:
        for i in range(len(startSlices)):
            startLine = find_nearest_key(starts.keys(), startSlices[i])
            endLine = find_nearest_key(ends.keys(), endSlices[i])
            for k in range(starts[startLine], ends[endLine] + 1):
                lines.add(k)
        return ",".join(str(l) for l in lines)

    except Exception as e:
        print("error getting line numbers", e)
        return "0"
