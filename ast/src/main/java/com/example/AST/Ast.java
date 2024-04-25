package com.example.AST;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;

import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.Node;
import com.github.javaparser.ast.body.CallableDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.body.VariableDeclarator;
import com.github.javaparser.ast.comments.Comment;

import org.checkerframework.checker.units.qual.m;

public class Ast {
    public static List getNodes(CompilationUnit cu, Class nodeClass) {
        List res = new LinkedList<>();

        // Find all -> Walks the AST with pre-order traversal, returning all nodes of type "nodeType" that match the predicate.
        res.addAll(cu.findAll(nodeClass));
        return res;
    }

    public static CompilationUnit getCU() {
        /**
         * https://www.javadoc.io/doc/com.github.javaparser/javaparser-core/latest/index.html
         * https://youtu.be/vsn7BzJLBzo
         */
        
        CompilationUnit cu = new CompilationUnit();
		try {
            Class clazz = Ast.class;
            InputStream inputStream = clazz.getResourceAsStream("T01.txt"); // "T01.txt" is the path not absolute path
            String data = readFromInputStream(inputStream);
			cu = StaticJavaParser.parse(data); // When the parser creates nodes, it sets their source code position in the "range" field.

            // List n = getNodes(cu, Class.class);

            // for(int i= 0; i < n.size(); i++) {
            //     System.out.println(i + ") " + n.get(i).getClass());
            // }

            // System.out.println("print n: " + n.size());

            // List<Comment> allComments = cu.getAllComments();

            // ListIterator iterator = allComments.listIterator();
            
            // while(iterator.hasNext()) {
            // System.out.print(iterator.next() + " ");
            // }

			inputStream.close();

		} catch (Exception e) {
            e.printStackTrace();

        }

        return cu;
    }

    private static String readFromInputStream(InputStream inputStream) throws IOException {
        StringBuilder resultStringBuilder = new StringBuilder();
        InputStreamReader inoutstreamReader = new InputStreamReader(inputStream);
        try (BufferedReader br = new BufferedReader(inoutstreamReader)) {
            String line;
            while ((line = br.readLine()) != null) {
                resultStringBuilder.append(line).append("\n");
            }
        }
        return resultStringBuilder.toString();
    }
}