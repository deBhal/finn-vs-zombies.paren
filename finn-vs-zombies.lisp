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


(ps:defpsmacro temp (key &optional duration)
  "Create a property intended to be temporary by also noting the current time and, optionally, a duration"
  `(create ,key (merge (create :at (time))
                     (and ,duration (create :for ,duration)))))
