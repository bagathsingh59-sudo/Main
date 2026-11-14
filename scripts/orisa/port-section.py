#!/usr/bin/env python3
"""
Port one section of the Orisa HTML template to a React (TSX) component.

  python3 scripts/orisa/port-section.py <built-page.html> <css-selector-class> <ComponentName> [--nth N]

Reads the BUILT template page (1.Orisa_HTML_template/*.html, so includes
and loops are already expanded), finds the first element carrying the
given class, and writes src/components/orisa/legacy/<ComponentName>.tsx:

  * class -> className, SVG/HTML attributes renamed for JSX, inline
    styles turned into objects, comments dropped;
  * template animation classes mapped to this project's motion
    attributes (at_fade_anim -> data-fade, reveal-text -> data-reveal,
    odometer -> data-count, anim-zoomin -> data-zoomin ...);
  * images copied to public/orisa/tpl/ and re-pointed;
  * links to template pages re-pointed to this site's routes.

The component keeps the template's Bootstrap class names; their CSS comes
from src/styles/orisa/legacy.css (see build-legacy-css.mjs) and only
applies inside an `.o-legacy` wrapper.
"""
import html, json, os, re, shutil, sys
from html.parser import HTMLParser

TEMPLATE = os.environ.get(
    "ORISA_TEMPLATE",
    "/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template",
)
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(ROOT, "src/components/orisa/legacy")
IMG_DIR = os.path.join(ROOT, "public/orisa/tpl")

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
ROUTES = [
    (r"^index.*\.html$", "/"),
    (r"^about.*\.html$", "/about"),
    (r"^services.*\.html$", "/services"),
    (r"^contact.*\.html$", "/contact"),
    (r"^pricing\.html$", "/vaishnavi-pay#pricing"),
    (r"^team.*\.html$", "/about#team"),
    (r"^faqs\.html$", "/vaishnavi-pay#faq"),
    (r"^(portfolio|archive|blog|product).*\.html$", "/services"),
]
ATTR = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "autocomplete": "autoComplete",
    "maxlength": "maxLength", "readonly": "readOnly", "srcset": "srcSet", "crossorigin": "crossOrigin",
    "viewbox": "viewBox", "preserveaspectratio": "preserveAspectRatio", "xmlns:xlink": "xmlnsXlink",
    "xlink:href": "xlinkHref", "fetchpriority": "fetchPriority", "novalidate": "noValidate",
    "playsinline": "playsInline", "autoplay": "autoPlay", "colspan": "colSpan", "rowspan": "rowSpan",
}
BOOL = {"required", "disabled", "checked", "novalidate", "autoplay", "muted", "loop", "playsinline", "selected", "hidden", "open"}


def camel(name):
    return re.sub(r"-([a-z])", lambda m: m.group(1).upper(), name)


def route(href):
    if href.startswith(("mailto:", "tel:", "http", "#", "/")):
        return href
    base = href.split("#")[0]
    for pattern, target in ROUTES:
        if re.match(pattern, base):
            return target
    return "#"


def image(src):
    if not src.startswith("assets/"):
        return src
    rel = src[len("assets/imgs/"):] if src.startswith("assets/imgs/") else src[len("assets/"):]
    dest = os.path.join(IMG_DIR, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    source = os.path.join(TEMPLATE, src)
    if os.path.exists(source) and not os.path.exists(dest):
        shutil.copyfile(source, dest)
    return "/orisa/tpl/" + rel


class Node:
    def __init__(self, tag, attrs):
        self.tag, self.attrs, self.children = tag, attrs, []


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root", [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def find(node, cls, counter):
    if isinstance(node, str):
        return None
    classes = (dict(node.attrs).get("class") or "").split()
    if cls in classes:
        counter[0] -= 1
        if counter[0] < 0:
            return node
    for child in node.children:
        hit = find(child, cls, counter)
        if hit:
            return hit
    return None


def style_object(value):
    pairs = []
    for decl in value.split(";"):
        if ":" not in decl:
            continue
        k, v = decl.split(":", 1)
        k, v = k.strip(), v.strip()
        v = re.sub(r"url\((['\"]?)(assets/[^'\")]+)\1\)", lambda m: f"url('{image(m.group(2))}')", v)
        key = json.dumps(k) if k.startswith("--") else camel(k)
        pairs.append(f"{key}: {json.dumps(v)}")
    return "{{ " + ", ".join(pairs) + " }}"


def motion(attrs):
    """Translate the template's animation classes into data-* attributes."""
    a = dict(attrs)
    classes = (a.get("class") or "").split()
    extra = {}
    if "at_fade_anim" in classes:
        extra["data-fade"] = a.get("data-fade-from", "bottom")
        if a.get("data-delay"):
            extra["data-delay"] = a["data-delay"]
    for cls, attr in (("reveal-text", "data-reveal"), ("anim-zoomin", "data-zoomin"), ("text-scramble", "data-scramble"),
                      ("at-rise-animation", "data-rise"), ("at-char-animation", "data-chars")):
        if cls in classes:
            extra[attr] = ""
    if a.get("data-img-award"):
        image(a["data-img-award"])  # copy the hover-preview image too
    if "odometer" in classes and a.get("data-count"):
        extra["data-count"] = a["data-count"]
    keep = [c for c in classes if c not in ("at_fade_anim", "reveal-text", "anim-zoomin", "text-scramble",
                                             "at-rise-animation", "at-char-animation", "odometer", "anim-zoomin-wrap")]
    drop = {"data-fade-from", "data-delay", "data-count", "data-fade-offset", "data-ease", "data-speed", "data-duration", "data-on-scroll"}
    out = [(k, v) for k, v in attrs if k not in drop and k != "class"]
    if keep:
        out.insert(0, ("class", " ".join(keep)))
    return out + list(extra.items())


def text(s):
    """JSX-safe text: collapse whitespace, rebrand, wrap in {" "} when it has
    characters JSX would misread or meaningful edge spaces."""
    s = re.sub(r"\s+", " ", s)
    if not s.strip():
        return ""
    s = s.replace("Orisa Studio", "Vaishnavi Consultant").replace("Orisa", "Vaishnavi").replace("orisa.com", "vaishnaviconsultant.com")
    if re.search(r"[{}<>&'\"]", s) or s != s.strip():
        return "{" + json.dumps(s, ensure_ascii=False) + "}"
    return s


def render(node, depth):
    pad = "  " * depth
    if isinstance(node, str):
        t = text(node)
        return f"{pad}{t}\n" if t else ""
    if node.tag in ("script", "style"):
        return ""
    attrs = motion(node.attrs)
    parts = []
    for k, v in attrs:
        v = "" if v is None else v
        if k.startswith("on") or k in ("xmlns:xlink",):
            continue
        if k == "style":
            parts.append(f"style={style_object(v)}")
            continue
        if k == "href":
            v = route(v)
        if k == "src":
            v = image(v)
        if k == "data-background":
            parts.append(f"style={{{{ backgroundImage: \"url('{image(v)}')\" }}}}")
            continue
        if k == "alt":
            v = "" if v.lower() in ("orisa", "image", "img") else v
        name = k if k.startswith(("data-", "aria-")) else ATTR.get(k, camel(k) if "-" in k or ":" in k else k)
        if name in ("rows", "cols", "colSpan", "rowSpan", "tabIndex", "maxLength", "size") and v.lstrip("-").isdigit():
            parts.append(f"{name}={{{v}}}")
        elif k in BOOL and v in ("", k):
            parts.append(name)
        elif name == "value":
            parts.append(f'defaultValue="{html.escape(v, quote=True)}"')
        else:
            parts.append(f'{name}="{html.escape(v, quote=True)}"')
    open_tag = f"{pad}<{node.tag}" + ("".join(" " + p for p in parts))
    if node.tag in VOID or not node.children:
        return open_tag + " />\n"
    inner = "".join(render(c, depth + 1) for c in node.children)
    if not inner.strip():
        return open_tag + " />\n"
    return f"{open_tag}>\n{inner}{pad}</{node.tag}>\n"


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    page, cls, name = args[:3]
    nth = int(sys.argv[sys.argv.index("--nth") + 1]) if "--nth" in sys.argv else 0
    tree = Tree()
    tree.feed(re.sub(r"<!--.*?-->", "", open(os.path.join(TEMPLATE, page), encoding="utf8").read(), flags=re.S))
    node = find(tree.root, cls, [nth])
    if node is None:
        sys.exit(f"no element with class {cls!r} in {page}")
    body = render(node, 2)
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, name + ".tsx")
    with open(out, "w", encoding="utf8") as f:
        f.write(
            f"/* eslint-disable @next/next/no-img-element */\n"
            f"// Ported from Orisa `{page}` (.{cls}) by scripts/orisa/port-section.py.\n"
            f"// Template copy and images are kept as placeholders — edit freely.\n"
            f"export function {name}() {{\n  return (\n{body}  );\n}}\n"
        )
    print("wrote", os.path.relpath(out, ROOT), len(body), "chars")


if __name__ == "__main__":
    main()
