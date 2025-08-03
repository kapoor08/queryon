import ReactDOM from "react-dom/client";
import { ChatWidget } from "@/components";

// This method is used to normalize the attribute names of the web component. It converts kebab-case to camelCase. Example: `data-attribute-name` to `dataAttributeName`.
const normalizeAttribute = (attribute: string) => {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

class WidgetWebComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const props = this.getPropsFromAttributes();
    const root = ReactDOM.createRoot(this.shadowRoot!);
    root.render(<ChatWidget {...props} />);
  }

  getPropsFromAttributes() {
    const props: Record<string, string> = {};

    for (let index = 0; index < this.attributes.length; index++) {
      const attribute = this.attributes[index];
      props[normalizeAttribute(attribute.name)] = attribute.value;
    }

    return props;
  }
}

export default WidgetWebComponent;
