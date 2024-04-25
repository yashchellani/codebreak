package com.example.AST;

import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.Node;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.body.TypeDeclaration;
import com.github.javaparser.ast.visitor.TreeVisitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.*;

@SpringBootApplication
public class AstApplication {

	public static void main(String[] args) {
		SpringApplication.run(AstApplication.class, args);
		Node rootNode = Ast.getCU().findRootNode();
		// List<TypeDeclaration<?>> astTypes = Ast.getCU().getTypes();
		// for(int i= 0; i < astTypes.size(); i++) {
		// 	System.out.println(i + ") " + astTypes.get(i).getName());
		// }
		TraversedAst traversedAst = new TraversedAst();
		AstNode root = new AstNode(rootNode, 0, traversedAst.convertCodeRangeToString(rootNode));
        List<AstNode> postOrderOfAst = traversedAst.postorder(root);
		// String string_check_duplicate = "";

		for(int i= 0; i < postOrderOfAst.size(); i++) {
			Node node = postOrderOfAst.get(i).getNode();
			// if (node.toString().equals(string_check_duplicate)) {
			// 	System.out.println(i + ") same");
			// } else {
			// 	string_check_duplicate = node.toString();
				System.out.println(i + ") " + node.getClass() + "\n [ " + node.toString() + " ]" +  "\n Node Level: " + Integer. toString(postOrderOfAst.get(i).getLevel()));
				System.out.println("Node line number: " + postOrderOfAst.get(i).getCodeRange()); // Col & Row no. starts from 1. 
			// }
		}
	}
}