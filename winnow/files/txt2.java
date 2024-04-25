class Solution {
    public int[] twoSum(int[] nums, int target) {
        int [] toReturn = new int[2];
        for(int i = 0; i < nums.length-1; i++){
            int k = target - nums[i]; 
            for(int j = i+1; j < nums.length; j++){
                if(nums[j] == k){
                    toReturn[0] = i;
                    toReturn[1] = j;
                    return toReturn;
                }
            }
        }
        return toReturn;
    }
    
    
}