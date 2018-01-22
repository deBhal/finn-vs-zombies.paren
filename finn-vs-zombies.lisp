(ql:quickload :parenscript)

;; (slime-eval 'cl:*package*)
;; The # character in the printed package name fouls up something in the
;; connection, so we need to suppress that response.
;; So slime-eval runs in the swank-io package, which would appear not to
;; use the common lisp package.

(defpackage :fvz
  (:use :common-lisp :parenscript))

(defpackage :fvz
  (:use :common-lisp :parenscript))
(in-package :fvz)
(use-package :parenscript)

(ps:defpsmacro import (symbols from library)
                 (declare (ignore from))
                 `(progn ,@(loop for symbol in symbols
                              collect (let ((lib-sym (if (consp symbol)
                                                         (car symbol)
                                                         symbol))
                                            (my-sym (if (consp symbol)
                                                        (or (caddr symbol)
                                                            (cadr symbol))
                                                        symbol)))
                                        `(setf ,my-sym (@ ,library ,lib-sym))))))

(ps:defpsmacro transformation (slots &body keys-and-values)
  "Returns a function :: Object -> Object that binds the given slots, evaluates the given key-value pairs in that context, and returns a copy of the object those key-value pairs merged in.

  It's a convenience wrapper around the common process of updating some object. It's sort of similar to Ramda's evolve() function (http://ramdajs.com/docs/#evolve), but a bit more powerful in it's handling of results that depend on multiple or external values.

  e.g.
  (setf #'fibonacci-transformation
        (transformation (a b)
                        (:a b :b (+ a b))))
  (Fibonacci-transformation (create :a 1 :b 1))
  ;; {\"a\":1, \"b\":2}

  For now I'm going to accept the key/value pairs in or out of a list, so these are equivalent:
  (transformation (a b) (:a b :b (+ a b)))
  (transformation (a b) :a b :b (+ a b))"
  `(lambda (obj)
     (with-slots ,slots obj
       (merge obj
              ,(if (listp (car keys-and-values))
                   (cons 'create (car keys-and-values))
                   `(create ,@keys-and-values))))))
