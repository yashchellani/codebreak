package com.example.AST;

import java.util.*;

import com.github.javaparser.ast.Node;

public class AstNode {
    public Node node;
    public int level;
    String codeRange;
    public List<AstNode> children = new ArrayList<>();
 
    // Default constructor
    public AstNode() {}
 
    public AstNode(Node nodeInput)
    {
        node = nodeInput;
    }

    public AstNode(Node nodeInput, int levelInput)
    {
        node = nodeInput;
        level = levelInput;
    }
 
    public AstNode(Node nodeInput, List<AstNode> childrenInput, int levelInput)
    {
        node = nodeInput;
        children = childrenInput;
        level = levelInput;
    }

    public AstNode(Node nodeInput, int levelInput, String codeRangeInput)
    {
        node = nodeInput;
        level = levelInput;
        codeRange = codeRangeInput;
    }

    public Node getNode() {
        return node;
    }

    public void setNode(Node node) {
        this.node = node;
    }

    public List<AstNode> getChildren() {
        return children;
    }

    public void setChildren(List<AstNode> children) {
        this.children = children;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getCodeRange() {
        return codeRange;
    }

    public void setCodeRange(String codeRange) {
        this.codeRange = codeRange;
    }
}