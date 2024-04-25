class Solution {
    public int[] twoSum(int[] nums, int target) {
        int [] toReturn = new int[2];
        HashMap<Integer, Integer> map = new HashMap<>();
        for(int i = 0; i < nums.length; i++){
            if(!map.containsKey(nums[i])){
                map.put(target - nums[i] , i);
            } else{
                toReturn[0] = map.get(nums[i]);
                toReturn[1] = i;
                break;
            }
        }
        return toReturn;
    }
    
    
}