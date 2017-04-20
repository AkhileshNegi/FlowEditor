import * as React from "react";
import * as axios from "axios";
import * as Interfaces from '../interfaces'
import Plumber from '../services/Plumber';
import FlowStore from '../services/FlowStore';
import Config from '../services/Config';
import {NodeModal} from './Modal';

let UUID  = require("uuid");

/**
 * Base Action class for the rendered flow
 */
export class ActionComp<P extends Interfaces.ActionProps> extends React.Component<P, {}> {

    public form: HTMLFormElement;
    private modal: NodeModal;

    static contextTypes = {
        flow: React.PropTypes.object,
        node: React.PropTypes.object
    }
    
    context: Interfaces.FlowContext;
    
    constructor(props: P) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    setEditing(editing: boolean) {
        this.setState({editing: editing})
    }

    onClick (event: any) {
        console.log('click', this.props.uuid);
        if (!this.context.node.state.dragging) {
            this.modal.open();
        }
    }

    getClassName() {
        return this.props.type.split('_').join('-');
    }

    render() {
        let config = Config.get().getTypeConfig(this.props.type);
        let renderer = new config.renderer(this.props);

        var events = {}
        if (!this.context.node.isDragNode()) {
            events = {onMouseUpCapture: (event: any)=>{this.onClick(event)}}
        }

        return(
            <div>
                <div className={'action ' + this.getClassName()} {...events}>
                    <div className="action-title">
                      {config.name}
                    </div>
                    <div className="action-content">
                        {renderer.renderNode()}
                    </div>
                </div>
                <NodeModal 
                    ref={(ele: any) => {this.modal = ele}} 
                    initial={this.props}
                    renderer={renderer}
                /> 
            </div>
        )
    }
    
    getType() {
        return this.props.type;
    }
}

export default ActionComp;