public int[] twoSum(int[] numbers, int target) {
        Map<Integer, Integer> map = new HashMap<Integer, Integer>();
        for (int i = 0; i < numbers.length; map.put(numbers[i], ++i)) 
            if (map.containsKey(target - numbers[i])) 
                return new int[]{map.get(target - numbers[i]),i+1};
        return new int[]{0,0};
    }