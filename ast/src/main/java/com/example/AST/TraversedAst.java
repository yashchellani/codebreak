package com.example.AST;

import java.util.*;

import com.github.javaparser.ast.Node;

public class TraversedAst {
     
    // Helper class to push node and it's index
    // into the stack
    static class Pair {
        public AstNode node;
        public int childrenIndex;
        public Pair(AstNode nodeInput, int childrenIndexInput) {
            node = nodeInput;
            childrenIndex = childrenIndexInput;
        }
    }
    

    public String convertCodeRangeToString(Node theNode) {
        String nodeRange = theNode.getRange().toString();
        String subString = nodeRange.substring(nodeRange.indexOf("[") + 1, nodeRange.indexOf("]")); // compare similarities
        String[] subStringParts = subString.split("-");
        String lineColStart = subStringParts[0];
        String[] lineColStartParts = lineColStart.split(",");
        String lineStart = lineColStartParts[0].replace("(line ", "");
        String colStart = lineColStartParts[1].replace("col ", "").replace(")", "");
        String lineColEnd = subStringParts[1];
        String[] lineColEndParts = lineColEnd.split(",");
        String lineEnd = lineColEndParts[0].replace("(line ", "");
        String colEnd = lineColEndParts[1].replace("col ", "").replace(")", "");

        return lineStart + "," + colStart + "," + lineEnd + "," + colEnd;
    }

    // We will keep the start index as 0,
    // because first we always
    // process the left most children
    int currentRootIndex = 0;
    Stack<Pair> stack = new Stack<>();
    ArrayList<AstNode> postorderTraversal = new ArrayList<>();
    String duplicatedString = "";
    String duplicatedString2 = "";
    int level = 0;
     
    // Function to perform iterative postorder traversal
    public List<AstNode> postorder(AstNode root) {
        duplicatedString2 = root.getCodeRange();
        while (root != null || !stack.isEmpty()) {
            if (root != null) {
                 
                // Push the root and it's index
                // into the stack
                stack.push(new Pair(root, currentRootIndex));
                currentRootIndex = 0;
     
                // If root don't have any children's that
                // means we are already at the left most
                // node, so we will mark root as null
                if (root.getNode().getChildNodes().size() >= 1) {
                    level++;
                    root = new AstNode(root.getNode().getChildNodes().get(0), level, convertCodeRangeToString(root.getNode().getChildNodes().get(0)));
                } else {
                    root = null;
                }
                continue;
            }
     
            // We will pop the top of the stack and
            // add it to our answer
            Pair temp = stack.pop();
            // if(!(temp.node.getCodeRange().equals(duplicatedString))) {
                postorderTraversal.add(temp.node);
                // duplicatedString = temp.node.getCodeRange();
                level--;
            // }

            // Repeatedly we will the pop all the
            // elements from the stack till popped
            // element is last children of top of
            // the stack
            while (!stack.isEmpty() && temp.childrenIndex == stack.peek().node.getNode().getChildNodes().size() - 1) {
                temp = stack.pop();
                // if(!(temp.node.getCodeRange().equals(duplicatedString))) {
                    postorderTraversal.add(temp.node);
                    // duplicatedString = temp.node.getCodeRange();
                    level--;
                // }
            }
     
            // If stack is not empty, then simply assign
            // the root to the next children of top
            // of stack's node
            // would we have a tree that is:
            //         X
            //       X
            //     X
            //    X X 
            if (!stack.isEmpty()) {
                level++;
                root = new AstNode(stack.peek().node.getNode().getChildNodes().get(temp.childrenIndex + 1), level, convertCodeRangeToString(stack.peek().node.getNode().getChildNodes().get(temp.childrenIndex + 1)));
                currentRootIndex = temp.childrenIndex + 1;
            }
        }
        return postorderTraversal;
    }
}