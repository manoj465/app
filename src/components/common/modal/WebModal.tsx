import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { View } from 'react-native';

// create and get reference to Modal DOM node
const appRoot = document.getElementById('root');
appRoot?.insertAdjacentHTML('afterend', '<div id="modal-root"></div>');
const modalRoot = document.getElementById('modal-root');

interface Props {
    transparent?: any,
    animationType?: string
    visible?: boolean
}
class InnerModal extends Component<Props, { top: string }> {
    el: any = undefined
    constructor(props: Props) {
        super(props);
        this.el = document.createElement('div');
        this.state = {
            top: "100%"
        }
    }

    componentDidMount() {
        // https://reactjs.org/docs/portals.html

        // The portal element is inserted in the DOM tree after
        // the Modal's children are mounted, meaning that children
        // will be mounted on a detached DOM node. If a child
        // component requires to be attached to the DOM tree
        // immediately when mounted, for example to measure a
        // DOM node, or uses 'autoFocus' in a descendant, add
        // state to Modal and only render the children when Modal
        // is inserted in the DOM tree.
        modalRoot?.appendChild(this.el);
        this.setState({ top: "0%" })
    }

    componentWillUnmount() {
        modalRoot?.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            <div style={{
                alignItems: "center",
                justifyContent: "center",
                display: 'flex',
                flexDirection: "column",
                margin: 0,
                padding: 0,
                zIndex: 100,
                position: 'absolute',
                left: 0,
                top: this.state.top,
                flex: 1,
                height: "100%",
                width: "100%",
                backgroundColor: this.props.transparent ? 'transparent' : 'white',
                transition: "top 2s"
            }}>
                {this.props.children}
            </div>,
            this.el,
        );
    }
}

export default class Modal extends Component<Props, any> {
    render() {
        if (this.props.visible) {
            return <InnerModal {...this.props} />;
        }
        return null;
    }
}