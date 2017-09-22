# Description:
#  Javascript and C++ instrumentation-based profiling tools.
#  https://github.com/google/tracing-framework

package(default_visibility = ["//visibility:public"])

licenses(["notice"])  # BSD 3-clause

exports_files(["LICENSE"])

# Restricts most packages to use by WTF only.
# Selective rules we wish to support to external users are set to
# //visibility:public.
package_group(
    name = "internal",
    packages = [
        "//addons/...",
        "//app/...",
        "//assets/...",
        "//bin/...",
        "//bindings/...",
        "//extensions/...",
        "//externs/...",
        "//src/...",
        "//test/...",
        "//third_party/...",
    ],
)
