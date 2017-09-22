# Description:
#  WTF Javascript bindings.

package(default_visibility = ["//:internal"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

# ------------------------------------------------------------------------------
# JavaScript
# ------------------------------------------------------------------------------

# third_party js
filegroup(
    name = "third_party_js",
    srcs = [
        "//third_party/d3:colorbrewer",
    ],
)

SHARED_JS_FLAGS = [
    "--summary_detail_level=3",
    "--define=goog.DEBUG=false",
    "--define=goog.asserts.ENABLE_ASSERTS=false",
    "--create_source_map=%outname%.map",
    "--source_map_format=V3",
]

RELEASE_JS_FLAGS = [
    "--use_types_for_optimization",
    #"--collapse_variable_declarations",
    #"--collapse_anonymous_functions",
    #"--collapse_properties",
    #"--disambiguate_properties",
    # rewrites things to be smaller but likely not better
    # http://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/javascript/jscomp/FunctionRewriter.java
    #"--rewrite_function_expressions=false",
    # slow - may want disabled
    #"--devirtualize_prototype_methods",
    #"--devirtualize_prototype_methods=false",
]

# ------------------------------------------------------------------------------
# JavaScript : node
# ------------------------------------------------------------------------------

closure_js_library(
    name = "wtf_node_js_library",
    srcs = ["//src:all_files"],
)

closure_js_binary(
    name = "wtf_node_js_compiled",
    deps = [
        ":wtf_node_js_library",
    ],
    language = "ECMASCRIPT5_STRICT",
    entry_points = [
        "wtf.db.exports",
        "wtf.db.node",
        "wtf.replay.graphics.Step",
        "wtf.trace.exports",
        "wtf.trace.node",
    ],
    dependency_mode = "STRICT",
    compilation_level = "ADVANCED",
    output_wrapper = "module.exports = (function(exports){%output%;return this.wtf;}).call(global); delete global.wtf;",
    defs = SHARED_JS_FLAGS + RELEASE_JS_FLAGS + [
        "--define=goog.DEBUG=false",
        "--define=goog.asserts.ENABLE_ASSERTS=false",
        "--define=wtf.NODE=true",
        "--define=wtf.db.exports.ENABLE_EXPORTS=true",
        "--define=wtf.trace.exports.ENABLE_EXPORTS=true",
    ],
)
