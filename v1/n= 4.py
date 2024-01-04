def generateMatrix(n):
        s = 1
        terminal = 0
        start = 0
        end = n-2
        result = []
        for i in range(n):
            result.append([])
            for j in range(n):
                result[i].append(0)
        while terminal <= n/2:
            for i in range(start, end):
                result[start][i] = s
                s += 1
            for i in range(start, end):
                result[i][end] = s
                s += 1
            for i in range(end, start, -1):
                result[end][i] = s
                s += 1
            for i in range(end, start, -1):
                result[i][start] = s
                s += 1
            start += 1
            end -= 1
        return result
print(generateMatrix(3))

