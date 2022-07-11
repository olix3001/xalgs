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
                    <a href="index.html" data-type="index-link">api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
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
                                            'data-target="#controllers-links-module-AppModule-4ac0474f3f6d89aa4563609d4e0e653fa5cfb979535a8201e2b3dc8bda38a9673b3c0f2c1dd46cd05e06044a75e3351f7d1d6c9faa41b085c869f3fd4755dd6e"' : 'data-target="#xs-controllers-links-module-AppModule-4ac0474f3f6d89aa4563609d4e0e653fa5cfb979535a8201e2b3dc8bda38a9673b3c0f2c1dd46cd05e06044a75e3351f7d1d6c9faa41b085c869f3fd4755dd6e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-4ac0474f3f6d89aa4563609d4e0e653fa5cfb979535a8201e2b3dc8bda38a9673b3c0f2c1dd46cd05e06044a75e3351f7d1d6c9faa41b085c869f3fd4755dd6e"' :
                                            'id="xs-controllers-links-module-AppModule-4ac0474f3f6d89aa4563609d4e0e653fa5cfb979535a8201e2b3dc8bda38a9673b3c0f2c1dd46cd05e06044a75e3351f7d1d6c9faa41b085c869f3fd4755dd6e"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-4ac0474f3f6d89aa4563609d4e0e653fa5cfb979535a8201e2b3dc8bda38a9673b3c0f2c1dd46cd05e06044a75e3351f7d1d6c9faa41b085c869f3fd4755dd6e"' : 'data-target="#xs-injectables-links-module-AppModule-4ac0474f3f6d89aa4563609d4e0e653fa5cfb979535a8201e2b3dc8bda38a9673b3c0f2c1dd46cd05e06044a75e3351f7d1d6c9faa41b085c869f3fd4755dd6e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4ac0474f3f6d89aa4563609d4e0e653fa5cfb979535a8201e2b3dc8bda38a9673b3c0f2c1dd46cd05e06044a75e3351f7d1d6c9faa41b085c869f3fd4755dd6e"' :
                                        'id="xs-injectables-links-module-AppModule-4ac0474f3f6d89aa4563609d4e0e653fa5cfb979535a8201e2b3dc8bda38a9673b3c0f2c1dd46cd05e06044a75e3351f7d1d6c9faa41b085c869f3fd4755dd6e"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-70b0e85cd210c5d36a9a8c9eefec1be3dae0345b26c779d8b4c5cfd15ec3203b3f1887be56cdbfbe6290e50a3c24436b15835346528c2adea3f4465cdbf401ea"' : 'data-target="#xs-controllers-links-module-AuthModule-70b0e85cd210c5d36a9a8c9eefec1be3dae0345b26c779d8b4c5cfd15ec3203b3f1887be56cdbfbe6290e50a3c24436b15835346528c2adea3f4465cdbf401ea"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-70b0e85cd210c5d36a9a8c9eefec1be3dae0345b26c779d8b4c5cfd15ec3203b3f1887be56cdbfbe6290e50a3c24436b15835346528c2adea3f4465cdbf401ea"' :
                                            'id="xs-controllers-links-module-AuthModule-70b0e85cd210c5d36a9a8c9eefec1be3dae0345b26c779d8b4c5cfd15ec3203b3f1887be56cdbfbe6290e50a3c24436b15835346528c2adea3f4465cdbf401ea"' }>
                                            <li class="link">
                                                <a href="controllers/LoginController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-70b0e85cd210c5d36a9a8c9eefec1be3dae0345b26c779d8b4c5cfd15ec3203b3f1887be56cdbfbe6290e50a3c24436b15835346528c2adea3f4465cdbf401ea"' : 'data-target="#xs-injectables-links-module-AuthModule-70b0e85cd210c5d36a9a8c9eefec1be3dae0345b26c779d8b4c5cfd15ec3203b3f1887be56cdbfbe6290e50a3c24436b15835346528c2adea3f4465cdbf401ea"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-70b0e85cd210c5d36a9a8c9eefec1be3dae0345b26c779d8b4c5cfd15ec3203b3f1887be56cdbfbe6290e50a3c24436b15835346528c2adea3f4465cdbf401ea"' :
                                        'id="xs-injectables-links-module-AuthModule-70b0e85cd210c5d36a9a8c9eefec1be3dae0345b26c779d8b4c5cfd15ec3203b3f1887be56cdbfbe6290e50a3c24436b15835346528c2adea3f4465cdbf401ea"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TaskModule.html" data-type="entity-link" >TaskModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TaskModule-a4bb46ca3cec2377a671d70dc083a89c808975c0d1f889c7f6ef73b7eb3419fffa0e13e6e3dc9e5f42938cb909267206e802dd767bf6ce474cd9ab4d31e008c6"' : 'data-target="#xs-controllers-links-module-TaskModule-a4bb46ca3cec2377a671d70dc083a89c808975c0d1f889c7f6ef73b7eb3419fffa0e13e6e3dc9e5f42938cb909267206e802dd767bf6ce474cd9ab4d31e008c6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TaskModule-a4bb46ca3cec2377a671d70dc083a89c808975c0d1f889c7f6ef73b7eb3419fffa0e13e6e3dc9e5f42938cb909267206e802dd767bf6ce474cd9ab4d31e008c6"' :
                                            'id="xs-controllers-links-module-TaskModule-a4bb46ca3cec2377a671d70dc083a89c808975c0d1f889c7f6ef73b7eb3419fffa0e13e6e3dc9e5f42938cb909267206e802dd767bf6ce474cd9ab4d31e008c6"' }>
                                            <li class="link">
                                                <a href="controllers/SubmissionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubmissionsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/TaskController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TaskModule-a4bb46ca3cec2377a671d70dc083a89c808975c0d1f889c7f6ef73b7eb3419fffa0e13e6e3dc9e5f42938cb909267206e802dd767bf6ce474cd9ab4d31e008c6"' : 'data-target="#xs-injectables-links-module-TaskModule-a4bb46ca3cec2377a671d70dc083a89c808975c0d1f889c7f6ef73b7eb3419fffa0e13e6e3dc9e5f42938cb909267206e802dd767bf6ce474cd9ab4d31e008c6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TaskModule-a4bb46ca3cec2377a671d70dc083a89c808975c0d1f889c7f6ef73b7eb3419fffa0e13e6e3dc9e5f42938cb909267206e802dd767bf6ce474cd9ab4d31e008c6"' :
                                        'id="xs-injectables-links-module-TaskModule-a4bb46ca3cec2377a671d70dc083a89c808975c0d1f889c7f6ef73b7eb3419fffa0e13e6e3dc9e5f42938cb909267206e802dd767bf6ce474cd9ab4d31e008c6"' }>
                                        <li class="link">
                                            <a href="injectables/PdfService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PdfService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TaskQueueService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskQueueService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-e1c003de3877c47f98234bb596d7f4a4ff77d21ea386fa17afb87460d0061647cde2e3f70cca3307f20a21ad60a8e8113aaca422b049953f9b6bd908e7acd574"' : 'data-target="#xs-injectables-links-module-UsersModule-e1c003de3877c47f98234bb596d7f4a4ff77d21ea386fa17afb87460d0061647cde2e3f70cca3307f20a21ad60a8e8113aaca422b049953f9b6bd908e7acd574"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-e1c003de3877c47f98234bb596d7f4a4ff77d21ea386fa17afb87460d0061647cde2e3f70cca3307f20a21ad60a8e8113aaca422b049953f9b6bd908e7acd574"' :
                                        'id="xs-injectables-links-module-UsersModule-e1c003de3877c47f98234bb596d7f4a4ff77d21ea386fa17afb87460d0061647cde2e3f70cca3307f20a21ad60a8e8113aaca422b049953f9b6bd908e7acd574"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
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
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
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
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
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