'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">InfraCreate documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-ba5980cd405a54688b029e3466ec642e004b020c391feaab3eca0cc697ad25a3cf07fbbf8892787dab855637340959a0e1b48995c229e76d8bc226ea70b88068"' : 'data-target="#xs-components-links-module-AppModule-ba5980cd405a54688b029e3466ec642e004b020c391feaab3eca0cc697ad25a3cf07fbbf8892787dab855637340959a0e1b48995c229e76d8bc226ea70b88068"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-ba5980cd405a54688b029e3466ec642e004b020c391feaab3eca0cc697ad25a3cf07fbbf8892787dab855637340959a0e1b48995c229e76d8bc226ea70b88068"' :
                                            'id="xs-components-links-module-AppModule-ba5980cd405a54688b029e3466ec642e004b020c391feaab3eca0cc697ad25a3cf07fbbf8892787dab855637340959a0e1b48995c229e76d8bc226ea70b88068"' }>
                                            <li class="link">
                                                <a href="components/AboutUsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutUsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ComposerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ComposerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataInputComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataInputV2Component.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataInputV2Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DocsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DocsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HostComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HostComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HowToUseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HowToUseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MirroringModuleInstanceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MirroringModuleInstanceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarElementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavbarElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NetworkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NetworkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OffcanvasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OffcanvasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReteModuleComposerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReteModuleComposerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReteModuleVisualizerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReteModuleVisualizerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReteTheaterComposerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReteTheaterComposerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReteTheaterVisualizerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReteTheaterVisualizerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubnetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubnetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabnavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabnavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TheaterInternalServiceModuleInstanceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TheaterInternalServiceModuleInstanceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TheaterModuleInstanceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TheaterModuleInstanceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnderbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UnderbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisualizerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VisualizerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-ba5980cd405a54688b029e3466ec642e004b020c391feaab3eca0cc697ad25a3cf07fbbf8892787dab855637340959a0e1b48995c229e76d8bc226ea70b88068"' : 'data-target="#xs-injectables-links-module-AppModule-ba5980cd405a54688b029e3466ec642e004b020c391feaab3eca0cc697ad25a3cf07fbbf8892787dab855637340959a0e1b48995c229e76d8bc226ea70b88068"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-ba5980cd405a54688b029e3466ec642e004b020c391feaab3eca0cc697ad25a3cf07fbbf8892787dab855637340959a0e1b48995c229e76d8bc226ea70b88068"' :
                                        'id="xs-injectables-links-module-AppModule-ba5980cd405a54688b029e3466ec642e004b020c391feaab3eca0cc697ad25a3cf07fbbf8892787dab855637340959a0e1b48995c229e76d8bc226ea70b88068"' }>
                                        <li class="link">
                                            <a href="injectables/ModuleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModuleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ParseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TheaterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TheaterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ControlTemplate.html" data-type="entity-link" >ControlTemplate</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/_Control.html" data-type="entity-link" >_Control</a>
                            </li>
                            <li class="link">
                                <a href="classes/Aoption.html" data-type="entity-link" >Aoption</a>
                            </li>
                            <li class="link">
                                <a href="classes/AreaApplication.html" data-type="entity-link" >AreaApplication</a>
                            </li>
                            <li class="link">
                                <a href="classes/AreaColorDTO.html" data-type="entity-link" >AreaColorDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AreaDTO.html" data-type="entity-link" >AreaDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AreaExport.html" data-type="entity-link" >AreaExport</a>
                            </li>
                            <li class="link">
                                <a href="classes/BlueprintFileDTO.html" data-type="entity-link" >BlueprintFileDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/BorderNetworkDTO.html" data-type="entity-link" >BorderNetworkDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigurationTemplateDTO.html" data-type="entity-link" >ConfigurationTemplateDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstraintsMSD.html" data-type="entity-link" >ConstraintsMSD</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsumerInterfaceLinkDTO.html" data-type="entity-link" >ConsumerInterfaceLinkDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsumerInterfaceLinkExport.html" data-type="entity-link" >ConsumerInterfaceLinkExport</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataInput.html" data-type="entity-link" >DataInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataInputCheck.html" data-type="entity-link" >DataInputCheck</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataInputElement.html" data-type="entity-link" >DataInputElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataInputReturned.html" data-type="entity-link" >DataInputReturned</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataInputSelection.html" data-type="entity-link" >DataInputSelection</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataInputText.html" data-type="entity-link" >DataInputText</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataRouteComposer.html" data-type="entity-link" >DataRouteComposer</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataRouteVisualizer.html" data-type="entity-link" >DataRouteVisualizer</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeployInstanceDTO.html" data-type="entity-link" >DeployInstanceDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ElementIntoTheaterDTO.html" data-type="entity-link" >ElementIntoTheaterDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmptyModuleInfo.html" data-type="entity-link" >EmptyModuleInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmptyNodeInfo.html" data-type="entity-link" >EmptyNodeInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityNameMappingFileDTO.html" data-type="entity-link" >EntityNameMappingFileDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExportModule.html" data-type="entity-link" >ExportModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExportTheater.html" data-type="entity-link" >ExportTheater</a>
                            </li>
                            <li class="link">
                                <a href="classes/FlavorApplication.html" data-type="entity-link" >FlavorApplication</a>
                            </li>
                            <li class="link">
                                <a href="classes/FlavorBasicInfo.html" data-type="entity-link" >FlavorBasicInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/FlavorDTO.html" data-type="entity-link" >FlavorDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenericParameterDTO.html" data-type="entity-link" >GenericParameterDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/HostModuleDTO.html" data-type="entity-link" >HostModuleDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/HostNode.html" data-type="entity-link" >HostNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/HostPortModuleDTO.html" data-type="entity-link" >HostPortModuleDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/InterfaceConstraints.html" data-type="entity-link" >InterfaceConstraints</a>
                            </li>
                            <li class="link">
                                <a href="classes/InterfaceNetworksConsumer.html" data-type="entity-link" >InterfaceNetworksConsumer</a>
                            </li>
                            <li class="link">
                                <a href="classes/InterfaceNetworksProvider.html" data-type="entity-link" >InterfaceNetworksProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/MirroringModuleInstanceNode.html" data-type="entity-link" >MirroringModuleInstanceNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModalButton.html" data-type="entity-link" >ModalButton</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModalItem.html" data-type="entity-link" >ModalItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleApplication.html" data-type="entity-link" >ModuleApplication</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleClassificationDTO.html" data-type="entity-link" >ModuleClassificationDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleConstraints.html" data-type="entity-link" >ModuleConstraints</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleDTO.html" data-type="entity-link" >ModuleDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleExport.html" data-type="entity-link" >ModuleExport</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleInstance.html" data-type="entity-link" >ModuleInstance</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleInstanceDTO.html" data-type="entity-link" >ModuleInstanceDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleInstancePropertiesDTO.html" data-type="entity-link" >ModuleInstancePropertiesDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleInstanceSimpleData.html" data-type="entity-link" >ModuleInstanceSimpleData</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleListDTO.html" data-type="entity-link" >ModuleListDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleModeDTO.html" data-type="entity-link" >ModuleModeDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleNetworkInterfaceDTO.html" data-type="entity-link" >ModuleNetworkInterfaceDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleNodeTypeToRete.html" data-type="entity-link" >ModuleNodeTypeToRete</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleSimpleData.html" data-type="entity-link" >ModuleSimpleData</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModuleStatusDTO.html" data-type="entity-link" >ModuleStatusDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/NameMappingDTO.html" data-type="entity-link" >NameMappingDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/NavbarElement.html" data-type="entity-link" >NavbarElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/NavbarItem.html" data-type="entity-link" >NavbarItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/NetOSRouterDTO.html" data-type="entity-link" >NetOSRouterDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/NetworkConstraints.html" data-type="entity-link" >NetworkConstraints</a>
                            </li>
                            <li class="link">
                                <a href="classes/NetworkDTO.html" data-type="entity-link" >NetworkDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/NetworkNode.html" data-type="entity-link" >NetworkNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/NetworkSimpleData.html" data-type="entity-link" >NetworkSimpleData</a>
                            </li>
                            <li class="link">
                                <a href="classes/NodeSimpleData.html" data-type="entity-link" >NodeSimpleData</a>
                            </li>
                            <li class="link">
                                <a href="classes/NodeTopologyElement.html" data-type="entity-link" >NodeTopologyElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/OnChangeV2.html" data-type="entity-link" >OnChangeV2</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageableDTO.html" data-type="entity-link" >PageableDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParseDataForTheaterVisualizer.html" data-type="entity-link" >ParseDataForTheaterVisualizer</a>
                            </li>
                            <li class="link">
                                <a href="classes/PerseDataForModuleComposer.html" data-type="entity-link" >PerseDataForModuleComposer</a>
                            </li>
                            <li class="link">
                                <a href="classes/PerseDataForModuleVisualizer.html" data-type="entity-link" >PerseDataForModuleVisualizer</a>
                            </li>
                            <li class="link">
                                <a href="classes/PerseDataForTheaterComposer.html" data-type="entity-link" >PerseDataForTheaterComposer</a>
                            </li>
                            <li class="link">
                                <a href="classes/PortSimpleData.html" data-type="entity-link" >PortSimpleData</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertiesMISD.html" data-type="entity-link" >PropertiesMISD</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertiesMSD.html" data-type="entity-link" >PropertiesMSD</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertiesNSD.html" data-type="entity-link" >PropertiesNSD</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertiesSSD.html" data-type="entity-link" >PropertiesSSD</a>
                            </li>
                            <li class="link">
                                <a href="classes/PropertiesTSD.html" data-type="entity-link" >PropertiesTSD</a>
                            </li>
                            <li class="link">
                                <a href="classes/RelationshipsExport.html" data-type="entity-link" >RelationshipsExport</a>
                            </li>
                            <li class="link">
                                <a href="classes/reteBasicModuleInfo.html" data-type="entity-link" >reteBasicModuleInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/reteBasicNodeInfo.html" data-type="entity-link" >reteBasicNodeInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteConnection.html" data-type="entity-link" >ReteConnection</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteHostInfo.html" data-type="entity-link" >ReteHostInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteMirroringModuleInstanceInfo.html" data-type="entity-link" >ReteMirroringModuleInstanceInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteModuleComposerSettings.html" data-type="entity-link" >ReteModuleComposerSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteModuleVisualizerSettings.html" data-type="entity-link" >ReteModuleVisualizerSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteNetworkInfo.html" data-type="entity-link" >ReteNetworkInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteSubnetInfo.html" data-type="entity-link" >ReteSubnetInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteTheaterComposerSettings.html" data-type="entity-link" >ReteTheaterComposerSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteTheaterInternalServiceModuleInstanceInfo.html" data-type="entity-link" >ReteTheaterInternalServiceModuleInstanceInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteTheaterModuleInstanceInfo.html" data-type="entity-link" >ReteTheaterModuleInstanceInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReteTheaterVisualizerSettings.html" data-type="entity-link" >ReteTheaterVisualizerSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectOption.html" data-type="entity-link" >SelectOption</a>
                            </li>
                            <li class="link">
                                <a href="classes/SimpleAreaDTO.html" data-type="entity-link" >SimpleAreaDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SimpleModuleApplication.html" data-type="entity-link" >SimpleModuleApplication</a>
                            </li>
                            <li class="link">
                                <a href="classes/SimpleModuleDTO.html" data-type="entity-link" >SimpleModuleDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SingleDataInputReturned.html" data-type="entity-link" >SingleDataInputReturned</a>
                            </li>
                            <li class="link">
                                <a href="classes/SortDTO.html" data-type="entity-link" >SortDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SourceExport.html" data-type="entity-link" >SourceExport</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpinnerData.html" data-type="entity-link" >SpinnerData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatisticItemDTO.html" data-type="entity-link" >StatisticItemDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubnetDTO.html" data-type="entity-link" >SubnetDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubnetExport.html" data-type="entity-link" >SubnetExport</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubnetNode.html" data-type="entity-link" >SubnetNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubnetSimpleData.html" data-type="entity-link" >SubnetSimpleData</a>
                            </li>
                            <li class="link">
                                <a href="classes/TabnavElement.html" data-type="entity-link" >TabnavElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/TabnavItem.html" data-type="entity-link" >TabnavItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagCatalogueDTO.html" data-type="entity-link" >TagCatalogueDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagsExport.html" data-type="entity-link" >TagsExport</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagTIP.html" data-type="entity-link" >TagTIP</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterApplication.html" data-type="entity-link" >TheaterApplication</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterDTO.html" data-type="entity-link" >TheaterDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterExport.html" data-type="entity-link" >TheaterExport</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterInstanceDTO.html" data-type="entity-link" >TheaterInstanceDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterInstancePropertiesDTO.html" data-type="entity-link" >TheaterInstancePropertiesDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterInternalServiceModuleInstanceNode.html" data-type="entity-link" >TheaterInternalServiceModuleInstanceNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterModuleInstanceNode.html" data-type="entity-link" >TheaterModuleInstanceNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterNodeTypeToRete.html" data-type="entity-link" >TheaterNodeTypeToRete</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheaterSimpleData.html" data-type="entity-link" >TheaterSimpleData</a>
                            </li>
                            <li class="link">
                                <a href="classes/TheatreStatusDTO.html" data-type="entity-link" >TheatreStatusDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TopologyElement.html" data-type="entity-link" >TopologyElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/TypesCatalogueDTO.html" data-type="entity-link" >TypesCatalogueDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnderbarElement.html" data-type="entity-link" >UnderbarElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnderbarItem.html" data-type="entity-link" >UnderbarItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/VirtualizationEnvironmentTypeDTO.html" data-type="entity-link" >VirtualizationEnvironmentTypeDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/VirtualMachine.html" data-type="entity-link" >VirtualMachine</a>
                            </li>
                            <li class="link">
                                <a href="classes/VirtualMachinePorts.html" data-type="entity-link" >VirtualMachinePorts</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AttachmentsService.html" data-type="entity-link" >AttachmentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExportService.html" data-type="entity-link" >ExportService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link" >FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FlavorService.html" data-type="entity-link" >FlavorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModalService.html" data-type="entity-link" >ModalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModuleService.html" data-type="entity-link" >ModuleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ParseService.html" data-type="entity-link" >ParseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SpinnerService.html" data-type="entity-link" >SpinnerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageService.html" data-type="entity-link" >StorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TheaterService.html" data-type="entity-link" >TheaterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenService.html" data-type="entity-link" >TokenService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CommonModule.html" data-type="entity-link" >CommonModule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModuleTopology.html" data-type="entity-link" >ModuleTopology</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReteEditor.html" data-type="entity-link" >ReteEditor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TheaterTopology.html" data-type="entity-link" >TheaterTopology</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TopologyList.html" data-type="entity-link" >TopologyList</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});