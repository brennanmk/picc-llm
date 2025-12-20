/*!
 * surveyjs - Survey JavaScript library v1.12.9
 * Copyright (c) 2015-2024 Devsoft Baltic OÜ  - http://surveyjs.io/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("jquery"); } catch(e) {} }()), require("survey-core"));
	else if(typeof define === 'function' && define.amd)
		define("survey-js-ui", ["jquery", "survey-core"], factory);
	else if(typeof exports === 'object')
		exports["survey-js-ui"] = factory((function webpackLoadOptionalExternalModule() { try { return require("jquery"); } catch(e) {} }()), require("survey-core"));
	else
		root["SurveyUI"] = factory(root["jQuery"], root["Survey"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_jquery__, __WEBPACK_EXTERNAL_MODULE_survey_core__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/entries/js-ui.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/entries/js-ui.ts":
/*!********************************************!*\
  !*** ./src/entries/js-ui.ts + 103 modules ***!
  \********************************************/
/*! exports provided: useState, useId, useReducer, useEffect, useLayoutEffect, useInsertionEffect, useTransition, useDeferredValue, useSyncExternalStore, startTransition, useRef, useImperativeHandle, useMemo, useCallback, useContext, useDebugValue, version, Children, render, hydrate, unmountComponentAtNode, createPortal, createElement, createContext, createFactory, cloneElement, createRef, Fragment, isValidElement, isFragment, isMemo, findDOMNode, Component, PureComponent, memo, forwardRef, flushSync, unstable_batchedUpdates, StrictMode, Suspense, SuspenseList, lazy, renderSurvey, renderPopupSurvey, preact, Survey, attachKey2click, ReactSurveyElementsWrapper, SurveyNavigationBase, SurveyTimerPanel, SurveyPage, SurveyRow, SurveyPanel, SurveyFlowPanel, SurveyQuestion, SurveyElementErrors, SurveyQuestionAndErrorsCell, ReactSurveyElement, SurveyElementBase, SurveyQuestionElementBase, SurveyQuestionCommentItem, SurveyQuestionComment, SurveyQuestionCheckbox, SurveyQuestionCheckboxItem, SurveyQuestionRanking, SurveyQuestionRankingItem, SurveyQuestionRankingItemContent, RatingItem, RatingItemStar, RatingItemSmiley, RatingDropdownItem, TagboxFilterString, SurveyQuestionOptionItem, SurveyQuestionDropdownBase, SurveyQuestionDropdown, SurveyQuestionTagboxItem, SurveyQuestionTagbox, SurveyQuestionDropdownSelect, SurveyQuestionMatrix, SurveyQuestionMatrixRow, SurveyQuestionMatrixCell, SurveyQuestionHtml, SurveyQuestionFile, SurveyFileChooseButton, SurveyFilePreview, SurveyQuestionMultipleText, SurveyQuestionRadiogroup, SurveyQuestionRadioItem, SurveyQuestionText, SurveyQuestionBoolean, SurveyQuestionBooleanCheckbox, SurveyQuestionBooleanRadio, SurveyQuestionEmpty, SurveyQuestionMatrixDropdownCell, SurveyQuestionMatrixDropdownBase, SurveyQuestionMatrixDropdown, SurveyQuestionMatrixDynamic, SurveyQuestionMatrixDynamicAddButton, SurveyQuestionPanelDynamic, SurveyProgress, SurveyProgressButtons, SurveyProgressToc, SurveyQuestionRating, SurveyQuestionRatingDropdown, SurveyQuestionExpression, PopupSurvey, SurveyWindow, ReactQuestionFactory, ReactElementFactory, SurveyQuestionImagePicker, SurveyQuestionImage, SurveyQuestionSignaturePad, SurveyQuestionButtonGroup, SurveyQuestionCustom, SurveyQuestionComposite, Popup, ListItemContent, ListItemGroup, List, TitleActions, TitleElement, SurveyActionBar, LogoImage, SurveyHeader, SvgIcon, SurveyQuestionMatrixDynamicRemoveButton, SurveyQuestionMatrixDetailButton, SurveyQuestionMatrixDynamicDragDropIcon, SurveyQuestionPanelDynamicAddButton, SurveyQuestionPanelDynamicRemoveButton, SurveyQuestionPanelDynamicPrevButton, SurveyQuestionPanelDynamicNextButton, SurveyQuestionPanelDynamicProgressText, SurveyNavigationButton, QuestionErrorComponent, MatrixRow, Skeleton, NotifierComponent, ComponentsContainer, CharacterCounterComponent, HeaderMobile, HeaderCell, Header, SurveyLocStringViewer, SurveyLocStringEditor, LoadingIndicatorComponent, SvgBundleComponent, PopupModal, SurveyModel, SurveyWindowModel, settings, surveyLocalization, surveyStrings, Model */
/*! ModuleConcatenation bailout: Cannot concat with external {"root":"Survey","commonjs2":"survey-core","commonjs":"survey-core","amd":"survey-core"} (<- Module is not an ECMAScript module) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "useState", function() { return /* reexport */ hooks_module_h; });
__webpack_require__.d(__webpack_exports__, "useId", function() { return /* reexport */ hooks_module_g; });
__webpack_require__.d(__webpack_exports__, "useReducer", function() { return /* reexport */ hooks_module_p; });
__webpack_require__.d(__webpack_exports__, "useEffect", function() { return /* reexport */ hooks_module_y; });
__webpack_require__.d(__webpack_exports__, "useLayoutEffect", function() { return /* reexport */ hooks_module_; });
__webpack_require__.d(__webpack_exports__, "useInsertionEffect", function() { return /* reexport */ Sn; });
__webpack_require__.d(__webpack_exports__, "useTransition", function() { return /* reexport */ bn; });
__webpack_require__.d(__webpack_exports__, "useDeferredValue", function() { return /* reexport */ _n; });
__webpack_require__.d(__webpack_exports__, "useSyncExternalStore", function() { return /* reexport */ En; });
__webpack_require__.d(__webpack_exports__, "startTransition", function() { return /* reexport */ yn; });
__webpack_require__.d(__webpack_exports__, "useRef", function() { return /* reexport */ hooks_module_A; });
__webpack_require__.d(__webpack_exports__, "useImperativeHandle", function() { return /* reexport */ hooks_module_F; });
__webpack_require__.d(__webpack_exports__, "useMemo", function() { return /* reexport */ hooks_module_T; });
__webpack_require__.d(__webpack_exports__, "useCallback", function() { return /* reexport */ hooks_module_q; });
__webpack_require__.d(__webpack_exports__, "useContext", function() { return /* reexport */ hooks_module_x; });
__webpack_require__.d(__webpack_exports__, "useDebugValue", function() { return /* reexport */ hooks_module_P; });
__webpack_require__.d(__webpack_exports__, "version", function() { return /* reexport */ on; });
__webpack_require__.d(__webpack_exports__, "Children", function() { return /* reexport */ compat_module_I; });
__webpack_require__.d(__webpack_exports__, "render", function() { return /* reexport */ compat_module_$; });
__webpack_require__.d(__webpack_exports__, "hydrate", function() { return /* reexport */ compat_module_q; });
__webpack_require__.d(__webpack_exports__, "unmountComponentAtNode", function() { return /* reexport */ hn; });
__webpack_require__.d(__webpack_exports__, "createPortal", function() { return /* reexport */ compat_module_P; });
__webpack_require__.d(__webpack_exports__, "createElement", function() { return /* reexport */ _; });
__webpack_require__.d(__webpack_exports__, "createContext", function() { return /* reexport */ G; });
__webpack_require__.d(__webpack_exports__, "createFactory", function() { return /* reexport */ cn; });
__webpack_require__.d(__webpack_exports__, "cloneElement", function() { return /* reexport */ sn; });
__webpack_require__.d(__webpack_exports__, "createRef", function() { return /* reexport */ m; });
__webpack_require__.d(__webpack_exports__, "Fragment", function() { return /* reexport */ b; });
__webpack_require__.d(__webpack_exports__, "isValidElement", function() { return /* reexport */ fn; });
__webpack_require__.d(__webpack_exports__, "isFragment", function() { return /* reexport */ ln; });
__webpack_require__.d(__webpack_exports__, "isMemo", function() { return /* reexport */ an; });
__webpack_require__.d(__webpack_exports__, "findDOMNode", function() { return /* reexport */ vn; });
__webpack_require__.d(__webpack_exports__, "Component", function() { return /* reexport */ k; });
__webpack_require__.d(__webpack_exports__, "PureComponent", function() { return /* reexport */ compat_module_E; });
__webpack_require__.d(__webpack_exports__, "memo", function() { return /* reexport */ compat_module_C; });
__webpack_require__.d(__webpack_exports__, "forwardRef", function() { return /* reexport */ compat_module_w; });
__webpack_require__.d(__webpack_exports__, "flushSync", function() { return /* reexport */ pn; });
__webpack_require__.d(__webpack_exports__, "unstable_batchedUpdates", function() { return /* reexport */ dn; });
__webpack_require__.d(__webpack_exports__, "StrictMode", function() { return /* reexport */ mn; });
__webpack_require__.d(__webpack_exports__, "Suspense", function() { return /* reexport */ compat_module_D; });
__webpack_require__.d(__webpack_exports__, "SuspenseList", function() { return /* reexport */ compat_module_F; });
__webpack_require__.d(__webpack_exports__, "lazy", function() { return /* reexport */ compat_module_O; });
__webpack_require__.d(__webpack_exports__, "renderSurvey", function() { return /* binding */ renderSurvey; });
__webpack_require__.d(__webpack_exports__, "renderPopupSurvey", function() { return /* binding */ renderPopupSurvey; });
__webpack_require__.d(__webpack_exports__, "preact", function() { return /* binding */ preact; });
__webpack_require__.d(__webpack_exports__, "Survey", function() { return /* reexport */ reactSurvey_Survey; });
__webpack_require__.d(__webpack_exports__, "attachKey2click", function() { return /* reexport */ attachKey2click; });
__webpack_require__.d(__webpack_exports__, "ReactSurveyElementsWrapper", function() { return /* reexport */ reactsurveymodel_ReactSurveyElementsWrapper; });
__webpack_require__.d(__webpack_exports__, "SurveyNavigationBase", function() { return /* reexport */ SurveyNavigationBase; });
__webpack_require__.d(__webpack_exports__, "SurveyTimerPanel", function() { return /* reexport */ reacttimerpanel_SurveyTimerPanel; });
__webpack_require__.d(__webpack_exports__, "SurveyPage", function() { return /* reexport */ page_SurveyPage; });
__webpack_require__.d(__webpack_exports__, "SurveyRow", function() { return /* reexport */ row_SurveyRow; });
__webpack_require__.d(__webpack_exports__, "SurveyPanel", function() { return /* reexport */ panel_SurveyPanel; });
__webpack_require__.d(__webpack_exports__, "SurveyFlowPanel", function() { return /* reexport */ flow_panel_SurveyFlowPanel; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestion", function() { return /* reexport */ reactquestion_SurveyQuestion; });
__webpack_require__.d(__webpack_exports__, "SurveyElementErrors", function() { return /* reexport */ reactquestion_SurveyElementErrors; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionAndErrorsCell", function() { return /* reexport */ reactquestion_SurveyQuestionAndErrorsCell; });
__webpack_require__.d(__webpack_exports__, "ReactSurveyElement", function() { return /* reexport */ ReactSurveyElement; });
__webpack_require__.d(__webpack_exports__, "SurveyElementBase", function() { return /* reexport */ reactquestion_element_SurveyElementBase; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionElementBase", function() { return /* reexport */ reactquestion_element_SurveyQuestionElementBase; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionCommentItem", function() { return /* reexport */ reactquestion_comment_SurveyQuestionCommentItem; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionComment", function() { return /* reexport */ reactquestion_comment_SurveyQuestionComment; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionCheckbox", function() { return /* reexport */ reactquestion_checkbox_SurveyQuestionCheckbox; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionCheckboxItem", function() { return /* reexport */ reactquestion_checkbox_SurveyQuestionCheckboxItem; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionRanking", function() { return /* reexport */ reactquestion_ranking_SurveyQuestionRanking; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionRankingItem", function() { return /* reexport */ reactquestion_ranking_SurveyQuestionRankingItem; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionRankingItemContent", function() { return /* reexport */ reactquestion_ranking_SurveyQuestionRankingItemContent; });
__webpack_require__.d(__webpack_exports__, "RatingItem", function() { return /* reexport */ rating_item_RatingItem; });
__webpack_require__.d(__webpack_exports__, "RatingItemStar", function() { return /* reexport */ rating_item_star_RatingItemStar; });
__webpack_require__.d(__webpack_exports__, "RatingItemSmiley", function() { return /* reexport */ rating_item_smiley_RatingItemSmiley; });
__webpack_require__.d(__webpack_exports__, "RatingDropdownItem", function() { return /* reexport */ rating_dropdown_item_RatingDropdownItem; });
__webpack_require__.d(__webpack_exports__, "TagboxFilterString", function() { return /* reexport */ tagbox_filter_TagboxFilterString; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionOptionItem", function() { return /* reexport */ dropdown_item_SurveyQuestionOptionItem; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionDropdownBase", function() { return /* reexport */ dropdown_base_SurveyQuestionDropdownBase; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionDropdown", function() { return /* reexport */ reactquestion_dropdown_SurveyQuestionDropdown; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionTagboxItem", function() { return /* reexport */ tagbox_item_SurveyQuestionTagboxItem; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionTagbox", function() { return /* reexport */ reactquestion_tagbox_SurveyQuestionTagbox; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionDropdownSelect", function() { return /* reexport */ dropdown_select_SurveyQuestionDropdownSelect; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrix", function() { return /* reexport */ reactquestion_matrix_SurveyQuestionMatrix; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixRow", function() { return /* reexport */ reactquestion_matrix_SurveyQuestionMatrixRow; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixCell", function() { return /* reexport */ reactquestion_matrix_SurveyQuestionMatrixCell; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionHtml", function() { return /* reexport */ reactquestion_html_SurveyQuestionHtml; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionFile", function() { return /* reexport */ reactquestion_file_SurveyQuestionFile; });
__webpack_require__.d(__webpack_exports__, "SurveyFileChooseButton", function() { return /* reexport */ file_choose_button_SurveyFileChooseButton; });
__webpack_require__.d(__webpack_exports__, "SurveyFilePreview", function() { return /* reexport */ file_preview_SurveyFilePreview; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMultipleText", function() { return /* reexport */ reactquestion_multipletext_SurveyQuestionMultipleText; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionRadiogroup", function() { return /* reexport */ reactquestion_radiogroup_SurveyQuestionRadiogroup; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionRadioItem", function() { return /* reexport */ reactquestion_radiogroup_SurveyQuestionRadioItem; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionText", function() { return /* reexport */ reactquestion_text_SurveyQuestionText; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionBoolean", function() { return /* reexport */ boolean_SurveyQuestionBoolean; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionBooleanCheckbox", function() { return /* reexport */ boolean_checkbox_SurveyQuestionBooleanCheckbox; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionBooleanRadio", function() { return /* reexport */ boolean_radio_SurveyQuestionBooleanRadio; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionEmpty", function() { return /* reexport */ reactquestion_empty_SurveyQuestionEmpty; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDropdownCell", function() { return /* reexport */ reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownCell; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDropdownBase", function() { return /* reexport */ reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownBase; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDropdown", function() { return /* reexport */ SurveyQuestionMatrixDropdown; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDynamic", function() { return /* reexport */ reactquestion_matrixdynamic_SurveyQuestionMatrixDynamic; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDynamicAddButton", function() { return /* reexport */ reactquestion_matrixdynamic_SurveyQuestionMatrixDynamicAddButton; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionPanelDynamic", function() { return /* reexport */ reactquestion_paneldynamic_SurveyQuestionPanelDynamic; });
__webpack_require__.d(__webpack_exports__, "SurveyProgress", function() { return /* reexport */ progress_SurveyProgress; });
__webpack_require__.d(__webpack_exports__, "SurveyProgressButtons", function() { return /* reexport */ progressButtons_SurveyProgressButtons; });
__webpack_require__.d(__webpack_exports__, "SurveyProgressToc", function() { return /* reexport */ progressToc_SurveyProgressToc; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionRating", function() { return /* reexport */ reactquestion_rating_SurveyQuestionRating; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionRatingDropdown", function() { return /* reexport */ rating_dropdown_SurveyQuestionRatingDropdown; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionExpression", function() { return /* reexport */ reactquestion_expression_SurveyQuestionExpression; });
__webpack_require__.d(__webpack_exports__, "PopupSurvey", function() { return /* reexport */ react_popup_survey_PopupSurvey; });
__webpack_require__.d(__webpack_exports__, "SurveyWindow", function() { return /* reexport */ SurveyWindow; });
__webpack_require__.d(__webpack_exports__, "ReactQuestionFactory", function() { return /* reexport */ ReactQuestionFactory; });
__webpack_require__.d(__webpack_exports__, "ReactElementFactory", function() { return /* reexport */ ReactElementFactory; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionImagePicker", function() { return /* reexport */ imagepicker_SurveyQuestionImagePicker; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionImage", function() { return /* reexport */ image_SurveyQuestionImage; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionSignaturePad", function() { return /* reexport */ signaturepad_SurveyQuestionSignaturePad; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionButtonGroup", function() { return /* reexport */ reactquestion_buttongroup_SurveyQuestionButtonGroup; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionCustom", function() { return /* reexport */ reactquestion_custom_SurveyQuestionCustom; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionComposite", function() { return /* reexport */ reactquestion_custom_SurveyQuestionComposite; });
__webpack_require__.d(__webpack_exports__, "Popup", function() { return /* reexport */ popup_Popup; });
__webpack_require__.d(__webpack_exports__, "ListItemContent", function() { return /* reexport */ list_item_content_ListItemContent; });
__webpack_require__.d(__webpack_exports__, "ListItemGroup", function() { return /* reexport */ list_item_group_ListItemGroup; });
__webpack_require__.d(__webpack_exports__, "List", function() { return /* reexport */ list_List; });
__webpack_require__.d(__webpack_exports__, "TitleActions", function() { return /* reexport */ title_actions_TitleActions; });
__webpack_require__.d(__webpack_exports__, "TitleElement", function() { return /* reexport */ title_element_TitleElement; });
__webpack_require__.d(__webpack_exports__, "SurveyActionBar", function() { return /* reexport */ action_bar_SurveyActionBar; });
__webpack_require__.d(__webpack_exports__, "LogoImage", function() { return /* reexport */ logo_image_LogoImage; });
__webpack_require__.d(__webpack_exports__, "SurveyHeader", function() { return /* reexport */ survey_header_SurveyHeader; });
__webpack_require__.d(__webpack_exports__, "SvgIcon", function() { return /* reexport */ svg_icon_SvgIcon; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDynamicRemoveButton", function() { return /* reexport */ remove_button_SurveyQuestionMatrixDynamicRemoveButton; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDetailButton", function() { return /* reexport */ detail_button_SurveyQuestionMatrixDetailButton; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDynamicDragDropIcon", function() { return /* reexport */ drag_drop_icon_SurveyQuestionMatrixDynamicDragDropIcon; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionPanelDynamicAddButton", function() { return /* reexport */ paneldynamic_add_btn_SurveyQuestionPanelDynamicAddButton; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionPanelDynamicRemoveButton", function() { return /* reexport */ paneldynamic_remove_btn_SurveyQuestionPanelDynamicRemoveButton; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionPanelDynamicPrevButton", function() { return /* reexport */ paneldynamic_prev_btn_SurveyQuestionPanelDynamicPrevButton; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionPanelDynamicNextButton", function() { return /* reexport */ paneldynamic_next_btn_SurveyQuestionPanelDynamicNextButton; });
__webpack_require__.d(__webpack_exports__, "SurveyQuestionPanelDynamicProgressText", function() { return /* reexport */ paneldynamic_progress_text_SurveyQuestionPanelDynamicProgressText; });
__webpack_require__.d(__webpack_exports__, "SurveyNavigationButton", function() { return /* reexport */ survey_nav_button_SurveyNavigationButton; });
__webpack_require__.d(__webpack_exports__, "QuestionErrorComponent", function() { return /* reexport */ question_error_QuestionErrorComponent; });
__webpack_require__.d(__webpack_exports__, "MatrixRow", function() { return /* reexport */ row_MatrixRow; });
__webpack_require__.d(__webpack_exports__, "Skeleton", function() { return /* reexport */ skeleton_Skeleton; });
__webpack_require__.d(__webpack_exports__, "NotifierComponent", function() { return /* reexport */ notifier_NotifierComponent; });
__webpack_require__.d(__webpack_exports__, "ComponentsContainer", function() { return /* reexport */ components_container_ComponentsContainer; });
__webpack_require__.d(__webpack_exports__, "CharacterCounterComponent", function() { return /* reexport */ character_counter_CharacterCounterComponent; });
__webpack_require__.d(__webpack_exports__, "HeaderMobile", function() { return /* reexport */ header_HeaderMobile; });
__webpack_require__.d(__webpack_exports__, "HeaderCell", function() { return /* reexport */ header_HeaderCell; });
__webpack_require__.d(__webpack_exports__, "Header", function() { return /* reexport */ header_Header; });
__webpack_require__.d(__webpack_exports__, "SurveyLocStringViewer", function() { return /* reexport */ string_viewer_SurveyLocStringViewer; });
__webpack_require__.d(__webpack_exports__, "SurveyLocStringEditor", function() { return /* reexport */ string_editor_SurveyLocStringEditor; });
__webpack_require__.d(__webpack_exports__, "LoadingIndicatorComponent", function() { return /* reexport */ loading_indicator_LoadingIndicatorComponent; });
__webpack_require__.d(__webpack_exports__, "SvgBundleComponent", function() { return /* reexport */ svgbundle_SvgBundleComponent; });
__webpack_require__.d(__webpack_exports__, "PopupModal", function() { return /* reexport */ popup_modal_PopupModal; });
__webpack_require__.d(__webpack_exports__, "SurveyModel", function() { return /* reexport */ external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyModel"]; });
__webpack_require__.d(__webpack_exports__, "SurveyWindowModel", function() { return /* reexport */ external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyWindowModel"]; });
__webpack_require__.d(__webpack_exports__, "settings", function() { return /* reexport */ external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"]; });
__webpack_require__.d(__webpack_exports__, "surveyLocalization", function() { return /* reexport */ external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["surveyLocalization"]; });
__webpack_require__.d(__webpack_exports__, "surveyStrings", function() { return /* reexport */ external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["surveyStrings"]; });
__webpack_require__.d(__webpack_exports__, "Model", function() { return /* reexport */ external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyModel"]; });

// NAMESPACE OBJECT: ./node_modules/preact/compat/dist/compat.module.js
var compat_module_namespaceObject = {};
__webpack_require__.r(compat_module_namespaceObject);
__webpack_require__.d(compat_module_namespaceObject, "Component", function() { return k; });
__webpack_require__.d(compat_module_namespaceObject, "Fragment", function() { return b; });
__webpack_require__.d(compat_module_namespaceObject, "createContext", function() { return G; });
__webpack_require__.d(compat_module_namespaceObject, "createElement", function() { return _; });
__webpack_require__.d(compat_module_namespaceObject, "createRef", function() { return m; });
__webpack_require__.d(compat_module_namespaceObject, "useCallback", function() { return hooks_module_q; });
__webpack_require__.d(compat_module_namespaceObject, "useContext", function() { return hooks_module_x; });
__webpack_require__.d(compat_module_namespaceObject, "useDebugValue", function() { return hooks_module_P; });
__webpack_require__.d(compat_module_namespaceObject, "useEffect", function() { return hooks_module_y; });
__webpack_require__.d(compat_module_namespaceObject, "useErrorBoundary", function() { return hooks_module_b; });
__webpack_require__.d(compat_module_namespaceObject, "useId", function() { return hooks_module_g; });
__webpack_require__.d(compat_module_namespaceObject, "useImperativeHandle", function() { return hooks_module_F; });
__webpack_require__.d(compat_module_namespaceObject, "useLayoutEffect", function() { return hooks_module_; });
__webpack_require__.d(compat_module_namespaceObject, "useMemo", function() { return hooks_module_T; });
__webpack_require__.d(compat_module_namespaceObject, "useReducer", function() { return hooks_module_p; });
__webpack_require__.d(compat_module_namespaceObject, "useRef", function() { return hooks_module_A; });
__webpack_require__.d(compat_module_namespaceObject, "useState", function() { return hooks_module_h; });
__webpack_require__.d(compat_module_namespaceObject, "Children", function() { return compat_module_I; });
__webpack_require__.d(compat_module_namespaceObject, "PureComponent", function() { return compat_module_E; });
__webpack_require__.d(compat_module_namespaceObject, "StrictMode", function() { return mn; });
__webpack_require__.d(compat_module_namespaceObject, "Suspense", function() { return compat_module_D; });
__webpack_require__.d(compat_module_namespaceObject, "SuspenseList", function() { return compat_module_F; });
__webpack_require__.d(compat_module_namespaceObject, "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED", function() { return un; });
__webpack_require__.d(compat_module_namespaceObject, "cloneElement", function() { return sn; });
__webpack_require__.d(compat_module_namespaceObject, "createFactory", function() { return cn; });
__webpack_require__.d(compat_module_namespaceObject, "createPortal", function() { return compat_module_P; });
__webpack_require__.d(compat_module_namespaceObject, "default", function() { return xn; });
__webpack_require__.d(compat_module_namespaceObject, "findDOMNode", function() { return vn; });
__webpack_require__.d(compat_module_namespaceObject, "flushSync", function() { return pn; });
__webpack_require__.d(compat_module_namespaceObject, "forwardRef", function() { return compat_module_w; });
__webpack_require__.d(compat_module_namespaceObject, "hydrate", function() { return compat_module_q; });
__webpack_require__.d(compat_module_namespaceObject, "isElement", function() { return gn; });
__webpack_require__.d(compat_module_namespaceObject, "isFragment", function() { return ln; });
__webpack_require__.d(compat_module_namespaceObject, "isMemo", function() { return an; });
__webpack_require__.d(compat_module_namespaceObject, "isValidElement", function() { return fn; });
__webpack_require__.d(compat_module_namespaceObject, "lazy", function() { return compat_module_O; });
__webpack_require__.d(compat_module_namespaceObject, "memo", function() { return compat_module_C; });
__webpack_require__.d(compat_module_namespaceObject, "render", function() { return compat_module_$; });
__webpack_require__.d(compat_module_namespaceObject, "startTransition", function() { return yn; });
__webpack_require__.d(compat_module_namespaceObject, "unmountComponentAtNode", function() { return hn; });
__webpack_require__.d(compat_module_namespaceObject, "unstable_batchedUpdates", function() { return dn; });
__webpack_require__.d(compat_module_namespaceObject, "useDeferredValue", function() { return _n; });
__webpack_require__.d(compat_module_namespaceObject, "useInsertionEffect", function() { return Sn; });
__webpack_require__.d(compat_module_namespaceObject, "useSyncExternalStore", function() { return En; });
__webpack_require__.d(compat_module_namespaceObject, "useTransition", function() { return bn; });
__webpack_require__.d(compat_module_namespaceObject, "version", function() { return on; });

// CONCATENATED MODULE: ./node_modules/preact/dist/preact.module.js
var preact_module_n,l,preact_module_u,preact_module_t,preact_module_i,preact_module_o,preact_module_r,preact_module_f,preact_module_e,preact_module_c,s,a,h={},v=[],p=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,y=Array.isArray;function d(n,l){for(var u in l)n[u]=l[u];return n}function w(n){n&&n.parentNode&&n.parentNode.removeChild(n)}function _(l,u,t){var i,o,r,f={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?preact_module_n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return g(l,f,i,o,null)}function g(n,t,i,o,r){var f={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:null==r?++preact_module_u:r,__i:-1,__u:0};return null==r&&null!=l.vnode&&l.vnode(f),f}function m(){return{current:null}}function b(n){return n.children}function k(n,l){this.props=n,this.context=l}function x(n,l){if(null==l)return n.__?x(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?x(n):null}function C(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return C(n)}}function S(n){(!n.__d&&(n.__d=!0)&&preact_module_i.push(n)&&!M.__r++||preact_module_o!==l.debounceRendering)&&((preact_module_o=l.debounceRendering)||preact_module_r)(M)}function M(){var n,u,t,o,r,e,c,s;for(preact_module_i.sort(preact_module_f);n=preact_module_i.shift();)n.__d&&(u=preact_module_i.length,o=void 0,e=(r=(t=n).__v).__e,c=[],s=[],t.__P&&((o=d({},r)).__v=r.__v+1,l.vnode&&l.vnode(o),O(t.__P,o,r,t.__n,t.__P.namespaceURI,32&r.__u?[e]:null,c,null==e?x(r):e,!!(32&r.__u),s),o.__v=r.__v,o.__.__k[o.__i]=o,j(c,o,s),o.__e!=e&&C(o)),preact_module_i.length>u&&preact_module_i.sort(preact_module_f));M.__r=0}function P(n,l,u,t,i,o,r,f,e,c,s){var a,p,y,d,w,_=t&&t.__k||v,g=l.length;for(u.__d=e,$(u,l,_),e=u.__d,a=0;a<g;a++)null!=(y=u.__k[a])&&(p=-1===y.__i?h:_[y.__i]||h,y.__i=a,O(n,y,p,i,o,r,f,e,c,s),d=y.__e,y.ref&&p.ref!=y.ref&&(p.ref&&N(p.ref,null,y),s.push(y.ref,y.__c||d,y)),null==w&&null!=d&&(w=d),65536&y.__u||p.__k===y.__k?e=I(y,e,n):"function"==typeof y.type&&void 0!==y.__d?e=y.__d:d&&(e=d.nextSibling),y.__d=void 0,y.__u&=-196609);u.__d=e,u.__e=w}function $(n,l,u){var t,i,o,r,f,e=l.length,c=u.length,s=c,a=0;for(n.__k=[],t=0;t<e;t++)null!=(i=l[t])&&"boolean"!=typeof i&&"function"!=typeof i?(r=t+a,(i=n.__k[t]="string"==typeof i||"number"==typeof i||"bigint"==typeof i||i.constructor==String?g(null,i,null,null,null):y(i)?g(b,{children:i},null,null,null):void 0===i.constructor&&i.__b>0?g(i.type,i.props,i.key,i.ref?i.ref:null,i.__v):i).__=n,i.__b=n.__b+1,o=null,-1!==(f=i.__i=L(i,u,r,s))&&(s--,(o=u[f])&&(o.__u|=131072)),null==o||null===o.__v?(-1==f&&a--,"function"!=typeof i.type&&(i.__u|=65536)):f!==r&&(f==r-1?a--:f==r+1?a++:(f>r?a--:a++,i.__u|=65536))):i=n.__k[t]=null;if(s)for(t=0;t<c;t++)null!=(o=u[t])&&0==(131072&o.__u)&&(o.__e==n.__d&&(n.__d=x(o)),V(o,o))}function I(n,l,u){var t,i;if("function"==typeof n.type){for(t=n.__k,i=0;t&&i<t.length;i++)t[i]&&(t[i].__=n,l=I(t[i],l,u));return l}n.__e!=l&&(l&&n.type&&!u.contains(l)&&(l=x(n)),u.insertBefore(n.__e,l||null),l=n.__e);do{l=l&&l.nextSibling}while(null!=l&&8===l.nodeType);return l}function H(n,l){return l=l||[],null==n||"boolean"==typeof n||(y(n)?n.some(function(n){H(n,l)}):l.push(n)),l}function L(n,l,u,t){var i=n.key,o=n.type,r=u-1,f=u+1,e=l[u];if(null===e||e&&i==e.key&&o===e.type&&0==(131072&e.__u))return u;if(t>(null!=e&&0==(131072&e.__u)?1:0))for(;r>=0||f<l.length;){if(r>=0){if((e=l[r])&&0==(131072&e.__u)&&i==e.key&&o===e.type)return r;r--}if(f<l.length){if((e=l[f])&&0==(131072&e.__u)&&i==e.key&&o===e.type)return f;f++}}return-1}function T(n,l,u){"-"===l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||p.test(l)?u:u+"px"}function A(n,l,u,t,i){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||T(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||T(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/(PointerCapture)$|Capture$/i,"$1")),l=l.toLowerCase()in n||"onFocusOut"===l||"onFocusIn"===l?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t?u.u=t.u:(u.u=preact_module_e,n.addEventListener(l,o?s:preact_module_c,o)):n.removeEventListener(l,o?s:preact_module_c,o);else{if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!==l[4]?n.removeAttribute(l):n.setAttribute(l,"popover"==l&&1==u?"":u))}}function F(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u.t)u.t=preact_module_e++;else if(u.t<t.u)return;return t(l.event?l.event(u):u)}}}function O(n,u,t,i,o,r,f,e,c,s){var a,h,v,p,w,_,g,m,x,C,S,M,$,I,H,L,T=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),r=[e=u.__e=t.__e]),(a=l.__b)&&a(u);n:if("function"==typeof T)try{if(m=u.props,x="prototype"in T&&T.prototype.render,C=(a=T.contextType)&&i[a.__c],S=a?C?C.props.value:a.__:i,t.__c?g=(h=u.__c=t.__c).__=h.__E:(x?u.__c=h=new T(m,S):(u.__c=h=new k(m,S),h.constructor=T,h.render=q),C&&C.sub(h),h.props=m,h.state||(h.state={}),h.context=S,h.__n=i,v=h.__d=!0,h.__h=[],h._sb=[]),x&&null==h.__s&&(h.__s=h.state),x&&null!=T.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=d({},h.__s)),d(h.__s,T.getDerivedStateFromProps(m,h.__s))),p=h.props,w=h.state,h.__v=u,v)x&&null==T.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),x&&null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else{if(x&&null==T.getDerivedStateFromProps&&m!==p&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,S),!h.__e&&(null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,S)||u.__v===t.__v)){for(u.__v!==t.__v&&(h.props=m,h.state=h.__s,h.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u)}),M=0;M<h._sb.length;M++)h.__h.push(h._sb[M]);h._sb=[],h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,S),x&&null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(p,w,_)})}if(h.context=S,h.props=m,h.__P=n,h.__e=!1,$=l.__r,I=0,x){for(h.state=h.__s,h.__d=!1,$&&$(u),a=h.render(h.props,h.state,h.context),H=0;H<h._sb.length;H++)h.__h.push(h._sb[H]);h._sb=[]}else do{h.__d=!1,$&&$(u),a=h.render(h.props,h.state,h.context),h.state=h.__s}while(h.__d&&++I<25);h.state=h.__s,null!=h.getChildContext&&(i=d(d({},i),h.getChildContext())),x&&!v&&null!=h.getSnapshotBeforeUpdate&&(_=h.getSnapshotBeforeUpdate(p,w)),P(n,y(L=null!=a&&a.type===b&&null==a.key?a.props.children:a)?L:[L],u,t,i,o,r,f,e,c,s),h.base=u.__e,u.__u&=-161,h.__h.length&&f.push(h),g&&(h.__E=h.__=null)}catch(n){if(u.__v=null,c||null!=r){for(u.__u|=c?160:128;e&&8===e.nodeType&&e.nextSibling;)e=e.nextSibling;r[r.indexOf(e)]=null,u.__e=e}else u.__e=t.__e,u.__k=t.__k;l.__e(n,u,t)}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=z(t.__e,u,t,i,o,r,f,c,s);(a=l.diffed)&&a(u)}function j(n,u,t){u.__d=void 0;for(var i=0;i<t.length;i++)N(t[i],t[++i],t[++i]);l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function z(u,t,i,o,r,f,e,c,s){var a,v,p,d,_,g,m,b=i.props,k=t.props,C=t.type;if("svg"===C?r="http://www.w3.org/2000/svg":"math"===C?r="http://www.w3.org/1998/Math/MathML":r||(r="http://www.w3.org/1999/xhtml"),null!=f)for(a=0;a<f.length;a++)if((_=f[a])&&"setAttribute"in _==!!C&&(C?_.localName===C:3===_.nodeType)){u=_,f[a]=null;break}if(null==u){if(null===C)return document.createTextNode(k);u=document.createElementNS(r,C,k.is&&k),c&&(l.__m&&l.__m(t,f),c=!1),f=null}if(null===C)b===k||c&&u.data===k||(u.data=k);else{if(f=f&&preact_module_n.call(u.childNodes),b=i.props||h,!c&&null!=f)for(b={},a=0;a<u.attributes.length;a++)b[(_=u.attributes[a]).name]=_.value;for(a in b)if(_=b[a],"children"==a);else if("dangerouslySetInnerHTML"==a)p=_;else if(!(a in k)){if("value"==a&&"defaultValue"in k||"checked"==a&&"defaultChecked"in k)continue;A(u,a,null,_,r)}for(a in k)_=k[a],"children"==a?d=_:"dangerouslySetInnerHTML"==a?v=_:"value"==a?g=_:"checked"==a?m=_:c&&"function"!=typeof _||b[a]===_||A(u,a,_,b[a],r);if(v)c||p&&(v.__html===p.__html||v.__html===u.innerHTML)||(u.innerHTML=v.__html),t.__k=[];else if(p&&(u.innerHTML=""),P(u,y(d)?d:[d],t,i,o,"foreignObject"===C?"http://www.w3.org/1999/xhtml":r,f,e,f?f[0]:i.__k&&x(i,0),c,s),null!=f)for(a=f.length;a--;)w(f[a]);c||(a="value","progress"===C&&null==g?u.removeAttribute("value"):void 0!==g&&(g!==u[a]||"progress"===C&&!g||"option"===C&&g!==b[a])&&A(u,a,g,b[a],r),a="checked",void 0!==m&&m!==u[a]&&A(u,a,m,b[a],r))}return u}function N(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u))}else n.current=u}catch(n){l.__e(n,t)}}function V(n,u,t){var i,o;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||N(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&V(i[o],u,t||"function"!=typeof n.type);t||w(n.__e),n.__c=n.__=n.__e=n.__d=void 0}function q(n,l,u){return this.constructor(n,u)}function B(u,t,i){var o,r,f,e;l.__&&l.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,f=[],e=[],O(t,u=(!o&&i||t).__k=_(b,null,[u]),r||h,h,t.namespaceURI,!o&&i?[i]:r?null:t.firstChild?preact_module_n.call(t.childNodes):null,f,!o&&i?i:r?r.__e:t.firstChild,o,e),j(f,u,e)}function D(n,l){B(n,l,D)}function E(l,u,t){var i,o,r,f,e=d({},l.props);for(r in l.type&&l.type.defaultProps&&(f=l.type.defaultProps),u)"key"==r?i=u[r]:"ref"==r?o=u[r]:e[r]=void 0===u[r]&&void 0!==f?f[r]:u[r];return arguments.length>2&&(e.children=arguments.length>3?preact_module_n.call(arguments,2):t),g(l.type,e,i||l.key,o||l.ref,null)}function G(n,l){var u={__c:l="__cC"+a++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=new Set,(t={})[l]=this,this.getChildContext=function(){return t},this.componentWillUnmount=function(){u=null},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.forEach(function(n){n.__e=!0,S(n)})},this.sub=function(n){u.add(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u&&u.delete(n),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u}preact_module_n=v.slice,l={__e:function(n,l,u,t){for(var i,o,r;l=l.__;)if((i=l.__c)&&!i.__)try{if((o=i.constructor)&&null!=o.getDerivedStateFromError&&(i.setState(o.getDerivedStateFromError(n)),r=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),r=i.__d),r)return i.__E=i}catch(l){n=l}throw n}},preact_module_u=0,preact_module_t=function(n){return null!=n&&null==n.constructor},k.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=d({},this.state),"function"==typeof n&&(n=n(d({},u),this.props)),n&&d(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),S(this))},k.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),S(this))},k.prototype.render=b,preact_module_i=[],preact_module_r="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,preact_module_f=function(n,l){return n.__v.__b-l.__v.__b},M.__r=0,preact_module_e=0,preact_module_c=F(!1),s=F(!0),a=0;
//# sourceMappingURL=preact.module.js.map

// CONCATENATED MODULE: ./node_modules/preact/hooks/dist/hooks.module.js
var hooks_module_t,hooks_module_r,hooks_module_u,hooks_module_i,hooks_module_o=0,hooks_module_f=[],hooks_module_c=l,hooks_module_e=hooks_module_c.__b,hooks_module_a=hooks_module_c.__r,hooks_module_v=hooks_module_c.diffed,hooks_module_l=hooks_module_c.__c,hooks_module_m=hooks_module_c.unmount,hooks_module_s=hooks_module_c.__;function hooks_module_d(n,t){hooks_module_c.__h&&hooks_module_c.__h(hooks_module_r,n,hooks_module_o||t),hooks_module_o=0;var u=hooks_module_r.__H||(hooks_module_r.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function hooks_module_h(n){return hooks_module_o=1,hooks_module_p(hooks_module_D,n)}function hooks_module_p(n,u,i){var o=hooks_module_d(hooks_module_t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):hooks_module_D(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}))}],o.__c=hooks_module_r,!hooks_module_r.u)){var f=function(n,t,r){if(!o.__c.__H)return!0;var u=o.__c.__H.__.filter(function(n){return!!n.__c});if(u.every(function(n){return!n.__N}))return!c||c.call(this,n,t,r);var i=!1;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0)}}),!(!i&&o.__c.props===n)&&(!c||c.call(this,n,t,r))};hooks_module_r.u=!0;var c=hooks_module_r.shouldComponentUpdate,e=hooks_module_r.componentWillUpdate;hooks_module_r.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u}e&&e.call(this,n,t,r)},hooks_module_r.shouldComponentUpdate=f}return o.__N||o.__}function hooks_module_y(n,u){var i=hooks_module_d(hooks_module_t++,3);!hooks_module_c.__s&&hooks_module_C(i.__H,u)&&(i.__=n,i.i=u,hooks_module_r.__H.__h.push(i))}function hooks_module_(n,u){var i=hooks_module_d(hooks_module_t++,4);!hooks_module_c.__s&&hooks_module_C(i.__H,u)&&(i.__=n,i.i=u,hooks_module_r.__h.push(i))}function hooks_module_A(n){return hooks_module_o=5,hooks_module_T(function(){return{current:n}},[])}function hooks_module_F(n,t,r){hooks_module_o=6,hooks_module_(function(){return"function"==typeof n?(n(t()),function(){return n(null)}):n?(n.current=t(),function(){return n.current=null}):void 0},null==r?r:r.concat(n))}function hooks_module_T(n,r){var u=hooks_module_d(hooks_module_t++,7);return hooks_module_C(u.__H,r)&&(u.__=n(),u.__H=r,u.__h=n),u.__}function hooks_module_q(n,t){return hooks_module_o=8,hooks_module_T(function(){return n},t)}function hooks_module_x(n){var u=hooks_module_r.context[n.__c],i=hooks_module_d(hooks_module_t++,9);return i.c=n,u?(null==i.__&&(i.__=!0,u.sub(hooks_module_r)),u.props.value):n.__}function hooks_module_P(n,t){hooks_module_c.useDebugValue&&hooks_module_c.useDebugValue(t?t(n):n)}function hooks_module_b(n){var u=hooks_module_d(hooks_module_t++,10),i=hooks_module_h();return u.__=n,hooks_module_r.componentDidCatch||(hooks_module_r.componentDidCatch=function(n,t){u.__&&u.__(n,t),i[1](n)}),[i[0],function(){i[1](void 0)}]}function hooks_module_g(){var n=hooks_module_d(hooks_module_t++,11);if(!n.__){for(var u=hooks_module_r.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="P"+i[0]+"-"+i[1]++}return n.__}function hooks_module_j(){for(var n;n=hooks_module_f.shift();)if(n.__P&&n.__H)try{n.__H.__h.forEach(hooks_module_z),n.__H.__h.forEach(hooks_module_B),n.__H.__h=[]}catch(t){n.__H.__h=[],hooks_module_c.__e(t,n.__v)}}hooks_module_c.__b=function(n){hooks_module_r=null,hooks_module_e&&hooks_module_e(n)},hooks_module_c.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),hooks_module_s&&hooks_module_s(n,t)},hooks_module_c.__r=function(n){hooks_module_a&&hooks_module_a(n),hooks_module_t=0;var i=(hooks_module_r=n.__c).__H;i&&(hooks_module_u===hooks_module_r?(i.__h=[],hooks_module_r.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.i=n.__N=void 0})):(i.__h.forEach(hooks_module_z),i.__h.forEach(hooks_module_B),i.__h=[],hooks_module_t=0)),hooks_module_u=hooks_module_r},hooks_module_c.diffed=function(n){hooks_module_v&&hooks_module_v(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==hooks_module_f.push(t)&&hooks_module_i===hooks_module_c.requestAnimationFrame||((hooks_module_i=hooks_module_c.requestAnimationFrame)||hooks_module_w)(hooks_module_j)),t.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.i=void 0})),hooks_module_u=hooks_module_r=null},hooks_module_c.__c=function(n,t){t.some(function(n){try{n.__h.forEach(hooks_module_z),n.__h=n.__h.filter(function(n){return!n.__||hooks_module_B(n)})}catch(r){t.some(function(n){n.__h&&(n.__h=[])}),t=[],hooks_module_c.__e(r,n.__v)}}),hooks_module_l&&hooks_module_l(n,t)},hooks_module_c.unmount=function(n){hooks_module_m&&hooks_module_m(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.forEach(function(n){try{hooks_module_z(n)}catch(n){t=n}}),r.__H=void 0,t&&hooks_module_c.__e(t,r.__v))};var hooks_module_k="function"==typeof requestAnimationFrame;function hooks_module_w(n){var t,r=function(){clearTimeout(u),hooks_module_k&&cancelAnimationFrame(t),setTimeout(n)},u=setTimeout(r,100);hooks_module_k&&(t=requestAnimationFrame(r))}function hooks_module_z(n){var t=hooks_module_r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),hooks_module_r=t}function hooks_module_B(n){var t=hooks_module_r;n.__c=n.__(),hooks_module_r=t}function hooks_module_C(n,t){return!n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function hooks_module_D(n,t){return"function"==typeof t?t(n):t}
//# sourceMappingURL=hooks.module.js.map

// CONCATENATED MODULE: ./node_modules/preact/compat/dist/compat.module.js
function compat_module_g(n,t){for(var e in n)if("__source"!==e&&!(e in t))return!0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return!0;return!1}function compat_module_E(n,t){this.props=n,this.context=t}function compat_module_C(n,e){function r(n){var t=this.props.ref,r=t==n.ref;return!r&&t&&(t.call?t(null):t.current=null),e?!e(this.props,n)||!r:compat_module_g(this.props,n)}function u(e){return this.shouldComponentUpdate=r,_(n,e)}return u.displayName="Memo("+(n.displayName||n.name)+")",u.prototype.isReactComponent=!0,u.__f=!0,u}(compat_module_E.prototype=new k).isPureReactComponent=!0,compat_module_E.prototype.shouldComponentUpdate=function(n,t){return compat_module_g(this.props,n)||compat_module_g(this.state,t)};var compat_module_x=l.__b;l.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),compat_module_x&&compat_module_x(n)};var R="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function compat_module_w(n){function t(t){if(!("ref"in t))return n(t,null);var e=t.ref;delete t.ref;var r=n(t,e);return t.ref=e,r}return t.$$typeof=R,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var compat_module_k=function(n,t){return null==n?null:H(H(n).map(t))},compat_module_I={map:compat_module_k,forEach:compat_module_k,count:function(n){return n?H(n).length:0},only:function(n){var t=H(n);if(1!==t.length)throw"Children.only";return t[0]},toArray:H},compat_module_N=l.__e;l.__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),u.__c(n,t);compat_module_N(n,t,e,r)};var compat_module_M=l.unmount;function compat_module_T(n,t,e){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c()}),n.__c.__H=null),null!=(n=function(n,t){for(var e in t)n[e]=t[e];return n}({},n)).__c&&(n.__c.__P===e&&(n.__c.__P=t),n.__c=null),n.__k=n.__k&&n.__k.map(function(n){return compat_module_T(n,t,e)})),n}function compat_module_A(n,t,e){return n&&e&&(n.__v=null,n.__k=n.__k&&n.__k.map(function(n){return compat_module_A(n,t,e)}),n.__c&&n.__c.__P===t&&(n.__e&&e.appendChild(n.__e),n.__c.__e=!0,n.__c.__P=e)),n}function compat_module_D(){this.__u=0,this.t=null,this.__b=null}function compat_module_L(n){var t=n.__.__c;return t&&t.__a&&t.__a(n)}function compat_module_O(n){var e,r,u;function o(o){if(e||(e=n()).then(function(n){r=n.default||n},function(n){u=n}),u)throw u;if(!r)throw e;return _(r,o)}return o.displayName="Lazy",o.__f=!0,o}function compat_module_F(){this.u=null,this.o=null}l.unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&32&n.__u&&(n.type=null),compat_module_M&&compat_module_M(n)},(compat_module_D.prototype=new k).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=compat_module_L(r.__v),o=!1,i=function(){o||(o=!0,e.__R=null,u?u(c):c())};e.__R=i;var c=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=compat_module_A(n,n.__c.__P,n.__c.__O)}var t;for(r.setState({__a:r.__b=null});t=r.t.pop();)t.forceUpdate()}};r.__u++||32&t.__u||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i)},compat_module_D.prototype.componentWillUnmount=function(){this.t=[]},compat_module_D.prototype.render=function(n,e){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),o=this.__v.__k[0].__c;this.__v.__k[0]=compat_module_T(this.__b,r,o.__O=o.__P)}this.__b=null}var i=e.__a&&_(b,null,n.fallback);return i&&(i.__u&=-33),[_(b,null,e.__a?null:n.children),i]};var U=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2]}};function compat_module_V(n){return this.getChildContext=function(){return n.context},n.children}function W(n){var e=this,r=n.i;e.componentWillUnmount=function(){B(null,e.l),e.l=null,e.i=null},e.i&&e.i!==r&&e.componentWillUnmount(),e.l||(e.i=r,e.l={nodeType:1,parentNode:r,childNodes:[],contains:function(){return!0},appendChild:function(n){this.childNodes.push(n),e.i.appendChild(n)},insertBefore:function(n,t){this.childNodes.push(n),e.i.appendChild(n)},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),e.i.removeChild(n)}}),B(_(compat_module_V,{context:e.context},n.__v),e.l)}function compat_module_P(n,e){var r=_(W,{__v:n,i:e});return r.containerInfo=e,r}(compat_module_F.prototype=new k).__a=function(n){var t=this,e=compat_module_L(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),U(t,n,r)):u()};e?e(o):o()}},compat_module_F.prototype.render=function(n){this.u=null,this.o=new Map;var t=H(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},compat_module_F.prototype.componentDidUpdate=compat_module_F.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){U(n,e,t)})};var compat_module_j="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,compat_module_z=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,compat_module_B=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,compat_module_H=/[A-Z0-9]/g,Z="undefined"!=typeof document,Y=function(n){return("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/:/fil|che|ra/).test(n)};function compat_module_$(n,t,e){return null==t.__k&&(t.textContent=""),B(n,t),"function"==typeof e&&e(),n?n.__c:null}function compat_module_q(n,t,e){return D(n,t),"function"==typeof e&&e(),n?n.__c:null}k.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(k.prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(n){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:n})}})});var compat_module_G=l.event;function J(){}function K(){return this.cancelBubble}function Q(){return this.defaultPrevented}l.event=function(n){return compat_module_G&&(n=compat_module_G(n)),n.persist=J,n.isPropagationStopped=K,n.isDefaultPrevented=Q,n.nativeEvent=n};var X,nn={enumerable:!1,configurable:!0,get:function(){return this.class}},tn=l.vnode;l.vnode=function(n){"string"==typeof n.type&&function(n){var t=n.props,e=n.type,u={},o=-1===e.indexOf("-");for(var i in t){var c=t[i];if(!("value"===i&&"defaultValue"in t&&null==c||Z&&"children"===i&&"noscript"===e||"class"===i||"className"===i)){var f=i.toLowerCase();"defaultValue"===i&&"value"in t&&null==t.value?i="value":"download"===i&&!0===c?c="":"translate"===f&&"no"===c?c=!1:"o"===f[0]&&"n"===f[1]?"ondoubleclick"===f?i="ondblclick":"onchange"!==f||"input"!==e&&"textarea"!==e||Y(t.type)?"onfocus"===f?i="onfocusin":"onblur"===f?i="onfocusout":compat_module_B.test(i)&&(i=f):f=i="oninput":o&&compat_module_z.test(i)?i=i.replace(compat_module_H,"-$&").toLowerCase():null===c&&(c=void 0),"oninput"===f&&u[i=f]&&(i="oninputCapture"),u[i]=c}}"select"==e&&u.multiple&&Array.isArray(u.value)&&(u.value=H(t.children).forEach(function(n){n.props.selected=-1!=u.value.indexOf(n.props.value)})),"select"==e&&null!=u.defaultValue&&(u.value=H(t.children).forEach(function(n){n.props.selected=u.multiple?-1!=u.defaultValue.indexOf(n.props.value):u.defaultValue==n.props.value})),t.class&&!t.className?(u.class=t.class,Object.defineProperty(u,"className",nn)):(t.className&&!t.class||t.class&&t.className)&&(u.class=u.className=t.className),n.props=u}(n),n.$$typeof=compat_module_j,tn&&tn(n)};var en=l.__r;l.__r=function(n){en&&en(n),X=n.__c};var rn=l.diffed;l.diffed=function(n){rn&&rn(n);var t=n.props,e=n.__e;null!=e&&"textarea"===n.type&&"value"in t&&t.value!==e.value&&(e.value=null==t.value?"":t.value),X=null};var un={ReactCurrentDispatcher:{current:{readContext:function(n){return X.__n[n.__c].props.value},useCallback:hooks_module_q,useContext:hooks_module_x,useDebugValue:hooks_module_P,useDeferredValue:_n,useEffect:hooks_module_y,useId:hooks_module_g,useImperativeHandle:hooks_module_F,useInsertionEffect:Sn,useLayoutEffect:hooks_module_,useMemo:hooks_module_T,useReducer:hooks_module_p,useRef:hooks_module_A,useState:hooks_module_h,useSyncExternalStore:En,useTransition:bn}}},on="18.3.1";function cn(n){return _.bind(null,n)}function fn(n){return!!n&&n.$$typeof===compat_module_j}function ln(n){return fn(n)&&n.type===b}function an(n){return!!n&&!!n.displayName&&("string"==typeof n.displayName||n.displayName instanceof String)&&n.displayName.startsWith("Memo(")}function sn(n){return fn(n)?E.apply(null,arguments):n}function hn(n){return!!n.__k&&(B(null,n),!0)}function vn(n){return n&&(n.base||1===n.nodeType&&n)||null}var dn=function(n,t){return n(t)},pn=function(n,t){return n(t)},mn=b;function yn(n){n()}function _n(n){return n}function bn(){return[!1,yn]}var Sn=hooks_module_,gn=fn;function En(n,t){var e=t(),r=hooks_module_h({h:{__:e,v:t}}),u=r[0].h,o=r[1];return hooks_module_(function(){u.__=e,u.v=t,Cn(u)&&o({h:u})},[n,e,t]),hooks_module_y(function(){return Cn(u)&&o({h:u}),n(function(){Cn(u)&&o({h:u})})},[n]),e}function Cn(n){var t,e,r=n.v,u=n.__;try{var o=r();return!((t=u)===(e=o)&&(0!==t||1/t==1/e)||t!=t&&e!=e)}catch(n){return!0}}var xn={useState:hooks_module_h,useId:hooks_module_g,useReducer:hooks_module_p,useEffect:hooks_module_y,useLayoutEffect:hooks_module_,useInsertionEffect:Sn,useTransition:bn,useDeferredValue:_n,useSyncExternalStore:En,startTransition:yn,useRef:hooks_module_A,useImperativeHandle:hooks_module_F,useMemo:hooks_module_T,useCallback:hooks_module_q,useContext:hooks_module_x,useDebugValue:hooks_module_P,version:"18.3.1",Children:compat_module_I,render:compat_module_$,hydrate:compat_module_q,unmountComponentAtNode:hn,createPortal:compat_module_P,createElement:_,createContext:G,createFactory:cn,cloneElement:sn,createRef:m,Fragment:b,isValidElement:fn,isElement:gn,isFragment:ln,isMemo:an,findDOMNode:vn,Component:k,PureComponent:compat_module_E,memo:compat_module_C,forwardRef:compat_module_w,flushSync:pn,unstable_batchedUpdates:dn,StrictMode:mn,Suspense:compat_module_D,SuspenseList:compat_module_F,lazy:compat_module_O,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:un};
//# sourceMappingURL=compat.module.js.map

// EXTERNAL MODULE: external {"root":"Survey","commonjs2":"survey-core","commonjs":"survey-core","amd":"survey-core"}
var external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_ = __webpack_require__("survey-core");

// CONCATENATED MODULE: ./packages/survey-react-ui/src/element-factory.tsx
var ReactElementFactory = /** @class */ (function () {
    function ReactElementFactory() {
        this.creatorHash = {};
    }
    ReactElementFactory.prototype.registerElement = function (elementType, elementCreator) {
        this.creatorHash[elementType] = elementCreator;
    };
    ReactElementFactory.prototype.getAllTypes = function () {
        var result = new Array();
        for (var key in this.creatorHash) {
            result.push(key);
        }
        return result.sort();
    };
    ReactElementFactory.prototype.isElementRegistered = function (elementType) {
        return !!this.creatorHash[elementType];
    };
    ReactElementFactory.prototype.createElement = function (elementType, params) {
        var creator = this.creatorHash[elementType];
        if (creator == null)
            return null;
        return creator(params);
    };
    ReactElementFactory.Instance = new ReactElementFactory();
    return ReactElementFactory;
}());


// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactsurveymodel.tsx


var reactsurveymodel_ReactSurveyElementsWrapper = /** @class */ (function () {
    function ReactSurveyElementsWrapper() {
    }
    ReactSurveyElementsWrapper.wrapRow = function (survey, element, row) {
        var componentName = survey.getRowWrapperComponentName(row);
        var componentData = survey.getRowWrapperComponentData(row);
        return ReactElementFactory.Instance.createElement(componentName, {
            element: element,
            row: row,
            componentData: componentData,
        });
    };
    ReactSurveyElementsWrapper.wrapElement = function (survey, element, question) {
        var componentName = survey.getElementWrapperComponentName(question);
        var componentData = survey.getElementWrapperComponentData(question);
        return ReactElementFactory.Instance.createElement(componentName, {
            element: element,
            question: question,
            componentData: componentData,
        });
    };
    ReactSurveyElementsWrapper.wrapQuestionContent = function (survey, element, question) {
        var componentName = survey.getQuestionContentWrapperComponentName(question);
        var componentData = survey.getElementWrapperComponentData(question);
        return ReactElementFactory.Instance.createElement(componentName, {
            element: element,
            question: question,
            componentData: componentData,
        });
    };
    ReactSurveyElementsWrapper.wrapItemValue = function (survey, element, question, item) {
        var componentName = survey.getItemValueWrapperComponentName(item, question);
        var componentData = survey.getItemValueWrapperComponentData(item, question);
        return ReactElementFactory.Instance.createElement(componentName, {
            key: element === null || element === void 0 ? void 0 : element.key,
            element: element,
            question: question,
            item: item,
            componentData: componentData,
        });
    };
    ReactSurveyElementsWrapper.wrapMatrixCell = function (survey, element, cell, reason) {
        if (reason === void 0) { reason = "cell"; }
        var componentName = survey.getElementWrapperComponentName(cell, reason);
        var componentData = survey.getElementWrapperComponentData(cell, reason);
        return ReactElementFactory.Instance.createElement(componentName, {
            element: element,
            cell: cell,
            componentData: componentData,
        });
    };
    return ReactSurveyElementsWrapper;
}());

external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyModel"].platform = "react";

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_element.tsx
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var reactquestion_element_SurveyElementBase = /** @class */ (function (_super) {
    __extends(SurveyElementBase, _super);
    function SurveyElementBase(props) {
        var _this = _super.call(this, props) || this;
        _this._allowComponentUpdate = true;
        _this.prevStateElements = [];
        return _this;
    }
    SurveyElementBase.renderLocString = function (locStr, style, key) {
        if (style === void 0) { style = null; }
        return ReactElementFactory.Instance.createElement(locStr.renderAs, {
            locStr: locStr.renderAsData,
            style: style,
            key: key,
        });
    };
    SurveyElementBase.renderQuestionDescription = function (question) {
        var descriptionText = SurveyElementBase.renderLocString(question.locDescription);
        return _("div", { style: question.hasDescription ? undefined : { display: "none" }, id: question.ariaDescriptionId, className: question.cssDescription }, descriptionText);
    };
    SurveyElementBase.prototype.componentDidMount = function () {
        this.makeBaseElementsReact();
    };
    SurveyElementBase.prototype.componentWillUnmount = function () {
        this.unMakeBaseElementsReact();
        this.disableStateElementsRerenderEvent(this.getStateElements());
    };
    SurveyElementBase.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a;
        this.makeBaseElementsReact();
        var stateElements = this.getStateElements();
        this.disableStateElementsRerenderEvent(((_a = this.prevStateElements) !== null && _a !== void 0 ? _a : []).filter(function (el) { return !stateElements.includes(el); }));
        this.prevStateElements = [];
        this.getStateElements().forEach(function (el) {
            el.afterRerender();
        });
    };
    SurveyElementBase.prototype.allowComponentUpdate = function () {
        this._allowComponentUpdate = true;
        this.forceUpdate();
    };
    SurveyElementBase.prototype.denyComponentUpdate = function () {
        this._allowComponentUpdate = false;
    };
    SurveyElementBase.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (this._allowComponentUpdate) {
            this.unMakeBaseElementsReact();
            this.prevStateElements = this.getStateElements();
        }
        return this._allowComponentUpdate;
    };
    SurveyElementBase.prototype.render = function () {
        if (!this.canRender()) {
            return null;
        }
        this.startEndRendering(1);
        var res = this.renderElement();
        this.startEndRendering(-1);
        if (!!res) {
            res = this.wrapElement(res);
        }
        this.changedStatePropNameValue = undefined;
        return res;
    };
    SurveyElementBase.prototype.wrapElement = function (element) {
        return element;
    };
    Object.defineProperty(SurveyElementBase.prototype, "isRendering", {
        get: function () {
            var stateEls = this.getRenderedElements();
            for (var _i = 0, stateEls_1 = stateEls; _i < stateEls_1.length; _i++) {
                var stateEl = stateEls_1[_i];
                if (stateEl.reactRendering > 0)
                    return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    SurveyElementBase.prototype.getRenderedElements = function () {
        return this.getStateElements();
    };
    SurveyElementBase.prototype.startEndRendering = function (val) {
        var stateEls = this.getRenderedElements();
        for (var _i = 0, stateEls_2 = stateEls; _i < stateEls_2.length; _i++) {
            var stateEl = stateEls_2[_i];
            if (!stateEl.reactRendering)
                stateEl.reactRendering = 0;
            stateEl.reactRendering += val;
        }
    };
    SurveyElementBase.prototype.canRender = function () {
        return true;
    };
    SurveyElementBase.prototype.renderElement = function () {
        return null;
    };
    Object.defineProperty(SurveyElementBase.prototype, "changedStatePropName", {
        get: function () {
            return this.changedStatePropNameValue;
        },
        enumerable: false,
        configurable: true
    });
    SurveyElementBase.prototype.makeBaseElementsReact = function () {
        var els = this.getStateElements();
        for (var i = 0; i < els.length; i++) {
            els[i].enableOnElementRerenderedEvent();
            this.makeBaseElementReact(els[i]);
        }
    };
    SurveyElementBase.prototype.unMakeBaseElementsReact = function () {
        var els = this.getStateElements();
        for (var i = 0; i < els.length; i++) {
            this.unMakeBaseElementReact(els[i]);
        }
    };
    SurveyElementBase.prototype.disableStateElementsRerenderEvent = function (els) {
        els.forEach(function (el) {
            el.disableOnElementRerenderedEvent();
        });
    };
    SurveyElementBase.prototype.getStateElements = function () {
        var el = this.getStateElement();
        return !!el ? [el] : [];
    };
    SurveyElementBase.prototype.getStateElement = function () {
        return null;
    };
    Object.defineProperty(SurveyElementBase.prototype, "isDisplayMode", {
        get: function () {
            var props = this.props;
            return props.isDisplayMode || false;
        },
        enumerable: false,
        configurable: true
    });
    SurveyElementBase.prototype.renderLocString = function (locStr, style, key) {
        if (style === void 0) { style = null; }
        return SurveyElementBase.renderLocString(locStr, style, key);
    };
    SurveyElementBase.prototype.canMakeReact = function (stateElement) {
        return !!stateElement && !!stateElement.iteratePropertiesHash;
    };
    SurveyElementBase.prototype.makeBaseElementReact = function (stateElement) {
        var _this = this;
        if (!this.canMakeReact(stateElement))
            return;
        stateElement.iteratePropertiesHash(function (hash, key) {
            if (!_this.canUsePropInState(key))
                return;
            var val = hash[key];
            if (Array.isArray(val)) {
                var val = val;
                val["onArrayChanged"] = function (arrayChanges) {
                    if (_this.isRendering)
                        return;
                    _this.changedStatePropNameValue = key;
                    _this.setState(function (state) {
                        var newState = {};
                        newState[key] = val;
                        return newState;
                    });
                };
            }
        });
        stateElement.setPropertyValueCoreHandler = function (hash, key, val) {
            if (hash[key] !== val) {
                hash[key] = val;
                if (!_this.canUsePropInState(key))
                    return;
                if (_this.isRendering)
                    return;
                _this.changedStatePropNameValue = key;
                _this.setState(function (state) {
                    var newState = {};
                    newState[key] = val;
                    return newState;
                });
            }
        };
    };
    SurveyElementBase.prototype.canUsePropInState = function (key) {
        return true;
    };
    SurveyElementBase.prototype.unMakeBaseElementReact = function (stateElement) {
        if (!this.canMakeReact(stateElement))
            return;
        stateElement.setPropertyValueCoreHandler = undefined;
        stateElement.iteratePropertiesHash(function (hash, key) {
            var val = hash[key];
            if (Array.isArray(val)) {
                var val = val;
                val["onArrayChanged"] = function () { };
            }
        });
    };
    return SurveyElementBase;
}(k));

var ReactSurveyElement = /** @class */ (function (_super) {
    __extends(ReactSurveyElement, _super);
    function ReactSurveyElement(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(ReactSurveyElement.prototype, "cssClasses", {
        get: function () {
            return this.props.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    return ReactSurveyElement;
}(reactquestion_element_SurveyElementBase));

var reactquestion_element_SurveyQuestionElementBase = /** @class */ (function (_super) {
    __extends(SurveyQuestionElementBase, _super);
    function SurveyQuestionElementBase(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionElementBase.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.updateDomElement();
    };
    SurveyQuestionElementBase.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.updateDomElement();
    };
    SurveyQuestionElementBase.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (!!this.questionBase) {
            var contentElement = this.content || this.control;
            this.questionBase.beforeDestroyQuestionElement(contentElement);
            if (!!contentElement) {
                contentElement.removeAttribute("data-rendered");
            }
        }
    };
    SurveyQuestionElementBase.prototype.updateDomElement = function () {
        var contentElement = this.content || this.control;
        if (!!contentElement) {
            if (contentElement.getAttribute("data-rendered") !== "r") {
                contentElement.setAttribute("data-rendered", "r");
                this.questionBase.afterRenderQuestionElement(contentElement);
            }
        }
    };
    Object.defineProperty(SurveyQuestionElementBase.prototype, "questionBase", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionElementBase.prototype.getRenderedElements = function () {
        return [this.questionBase];
    };
    Object.defineProperty(SurveyQuestionElementBase.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionElementBase.prototype.canRender = function () {
        return !!this.questionBase && !!this.creator;
    };
    SurveyQuestionElementBase.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (!_super.prototype.shouldComponentUpdate.call(this, nextProps, nextState))
            return false;
        return (!this.questionBase.customWidget ||
            !!this.questionBase.customWidgetData.isNeedRender ||
            !!this.questionBase.customWidget.widgetJson.isDefaultRender ||
            !!this.questionBase.customWidget.widgetJson.render);
    };
    Object.defineProperty(SurveyQuestionElementBase.prototype, "isDisplayMode", {
        get: function () {
            var props = this.props;
            return (props.isDisplayMode ||
                (!!this.questionBase && this.questionBase.isInputReadOnly) || false);
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionElementBase.prototype.wrapCell = function (cell, element, reason) {
        if (!reason) {
            return element;
        }
        var survey = this.questionBase
            .survey;
        var wrapper = null;
        if (survey) {
            wrapper = reactsurveymodel_ReactSurveyElementsWrapper.wrapMatrixCell(survey, element, cell, reason);
        }
        return wrapper !== null && wrapper !== void 0 ? wrapper : element;
    };
    SurveyQuestionElementBase.prototype.setControl = function (element) {
        if (!!element) {
            this.control = element;
        }
    };
    SurveyQuestionElementBase.prototype.setContent = function (element) {
        if (!!element) {
            this.content = element;
        }
    };
    return SurveyQuestionElementBase;
}(reactquestion_element_SurveyElementBase));

var reactquestion_element_SurveyQuestionUncontrolledElement = /** @class */ (function (_super) {
    __extends(SurveyQuestionUncontrolledElement, _super);
    function SurveyQuestionUncontrolledElement(props) {
        var _this = _super.call(this, props) || this;
        _this.updateValueOnEvent = function (event) {
            if (!external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["Helpers"].isTwoValueEquals(_this.questionBase.value, event.target.value, false, true, false)) {
                _this.setValueCore(event.target.value);
            }
        };
        _this.updateValueOnEvent = _this.updateValueOnEvent.bind(_this);
        return _this;
    }
    Object.defineProperty(SurveyQuestionUncontrolledElement.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionUncontrolledElement.prototype.setValueCore = function (newValue) {
        this.questionBase.value = newValue;
    };
    SurveyQuestionUncontrolledElement.prototype.getValueCore = function () {
        return this.questionBase.value;
    };
    SurveyQuestionUncontrolledElement.prototype.updateDomElement = function () {
        if (!!this.control) {
            var control = this.control;
            var newValue = this.getValueCore();
            if (!external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["Helpers"].isTwoValueEquals(newValue, control.value, false, true, false)) {
                control.value = this.getValue(newValue);
            }
        }
        _super.prototype.updateDomElement.call(this);
    };
    SurveyQuestionUncontrolledElement.prototype.getValue = function (val) {
        if (external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["Helpers"].isValueEmpty(val))
            return "";
        return val;
    };
    return SurveyQuestionUncontrolledElement;
}(reactquestion_element_SurveyQuestionElementBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/element.tsx
var element_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var element_SurveyRowElement = /** @class */ (function (_super) {
    element_extends(SurveyRowElement, _super);
    function SurveyRowElement(props) {
        var _this = _super.call(this, props) || this;
        _this.element.cssClasses;
        _this.rootRef = m();
        return _this;
    }
    SurveyRowElement.prototype.getStateElement = function () {
        return this.element;
    };
    Object.defineProperty(SurveyRowElement.prototype, "element", {
        get: function () {
            return this.props.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyRowElement.prototype, "index", {
        get: function () {
            return this.props.index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyRowElement.prototype, "row", {
        get: function () {
            return this.props.row;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyRowElement.prototype, "survey", {
        get: function () {
            return this.props.survey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyRowElement.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyRowElement.prototype, "css", {
        get: function () {
            return this.props.css;
        },
        enumerable: false,
        configurable: true
    });
    SurveyRowElement.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (this.rootRef.current) {
            (this.element).setWrapperElement(this.rootRef.current);
        }
    };
    SurveyRowElement.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.element.setWrapperElement(undefined);
    };
    SurveyRowElement.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (!_super.prototype.shouldComponentUpdate.call(this, nextProps, nextState))
            return false;
        if (nextProps.element !== this.element) {
            if (nextProps.element) {
                nextProps.element.setWrapperElement(this.rootRef.current);
            }
            if (this.element) {
                this.element.setWrapperElement(undefined);
            }
        }
        this.element.cssClasses;
        return true;
    };
    SurveyRowElement.prototype.renderElement = function () {
        var element = this.element;
        var innerElement = this.createElement(element, this.index);
        var css = element.cssClassesValue;
        var focusIn = function () {
            var el = element;
            if (el && el.isQuestion) {
                el.focusIn();
            }
        };
        return (_("div", { className: css.questionWrapper, style: element.rootStyle, "data-key": innerElement.key, key: innerElement.key, onFocus: focusIn, ref: this.rootRef }, innerElement));
    };
    SurveyRowElement.prototype.createElement = function (element, elementIndex) {
        var index = elementIndex ? "-" + elementIndex : 0;
        if (!this.row.isNeedRender) {
            return ReactElementFactory.Instance.createElement(element.skeletonComponentName, { key: element.name + index, element: element, css: this.css, });
        }
        var elementType = element.getType();
        if (!ReactElementFactory.Instance.isElementRegistered(elementType)) {
            elementType = "question";
        }
        return ReactElementFactory.Instance.createElement(elementType, {
            key: element.name + index,
            element: element,
            creator: this.creator,
            survey: this.survey,
            css: this.css,
        });
    };
    return SurveyRowElement;
}(reactquestion_element_SurveyElementBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/row.tsx
var row_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var row_SurveyRow = /** @class */ (function (_super) {
    row_extends(SurveyRow, _super);
    function SurveyRow(props) {
        var _this = _super.call(this, props) || this;
        _this.rootRef = m();
        _this.recalculateCss();
        return _this;
    }
    SurveyRow.prototype.recalculateCss = function () {
        this.row.visibleElements.map(function (element) { return element.cssClasses; });
    };
    SurveyRow.prototype.getStateElement = function () {
        return this.row;
    };
    Object.defineProperty(SurveyRow.prototype, "row", {
        get: function () {
            return this.props.row;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyRow.prototype, "survey", {
        get: function () {
            return this.props.survey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyRow.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyRow.prototype, "css", {
        get: function () {
            return this.props.css;
        },
        enumerable: false,
        configurable: true
    });
    SurveyRow.prototype.canRender = function () {
        return !!this.row && !!this.survey && !!this.creator;
    };
    SurveyRow.prototype.renderElementContent = function () {
        var _this = this;
        var elements = this.row.visibleElements.map(function (element, elementIndex) {
            var index = elementIndex ? "-" + elementIndex : 0;
            var key = element.name + index;
            return (_(element_SurveyRowElement, { element: element, index: elementIndex, row: _this.row, survey: _this.survey, creator: _this.creator, css: _this.css, key: key }));
        });
        return (_("div", { ref: this.rootRef, className: this.row.getRowCss() }, elements));
    };
    SurveyRow.prototype.renderElement = function () {
        var survey = this.survey;
        var content = this.renderElementContent();
        var wrapper = reactsurveymodel_ReactSurveyElementsWrapper.wrapRow(survey, content, this.row);
        return wrapper || content;
    };
    SurveyRow.prototype.componentDidMount = function () {
        var _this = this;
        _super.prototype.componentDidMount.call(this);
        var el = this.rootRef.current;
        if (this.rootRef.current) {
            this.row.setRootElement(this.rootRef.current);
        }
        if (!!el && !this.row.isNeedRender) {
            var rowContainerDiv = el;
            setTimeout(function () {
                _this.row.startLazyRendering(rowContainerDiv);
            }, 10);
        }
    };
    SurveyRow.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (!_super.prototype.shouldComponentUpdate.call(this, nextProps, nextState))
            return false;
        if (nextProps.row !== this.row) {
            nextProps.row.isNeedRender = this.row.isNeedRender;
            nextProps.row.setRootElement(this.rootRef.current);
            this.row.setRootElement(undefined);
            this.stopLazyRendering();
        }
        this.recalculateCss();
        return true;
    };
    SurveyRow.prototype.stopLazyRendering = function () {
        this.row.stopLazyRendering();
        this.row.isNeedRender = !this.row.isLazyRendering();
    };
    SurveyRow.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.row.setRootElement(undefined);
        this.stopLazyRendering();
    };
    SurveyRow.prototype.createElement = function (element, elementIndex) {
        var index = elementIndex ? "-" + elementIndex : 0;
        var elementType = element.getType();
        if (!ReactElementFactory.Instance.isElementRegistered(elementType)) {
            elementType = "question";
        }
        return ReactElementFactory.Instance.createElement(elementType, {
            key: element.name + index,
            element: element,
            creator: this.creator,
            survey: this.survey,
            css: this.css,
        });
    };
    return SurveyRow;
}(reactquestion_element_SurveyElementBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/panel-base.tsx
var panel_base_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var panel_base_SurveyPanelBase = /** @class */ (function (_super) {
    panel_base_extends(SurveyPanelBase, _super);
    function SurveyPanelBase(props) {
        var _this = _super.call(this, props) || this;
        _this.rootRef = m();
        return _this;
    }
    SurveyPanelBase.prototype.getStateElement = function () {
        return this.panelBase;
    };
    SurveyPanelBase.prototype.canUsePropInState = function (key) {
        return key !== "elements" && _super.prototype.canUsePropInState.call(this, key);
    };
    Object.defineProperty(SurveyPanelBase.prototype, "survey", {
        get: function () {
            return this.getSurvey();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyPanelBase.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyPanelBase.prototype, "css", {
        get: function () {
            return this.getCss();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyPanelBase.prototype, "panelBase", {
        get: function () {
            return this.getPanelBase();
        },
        enumerable: false,
        configurable: true
    });
    SurveyPanelBase.prototype.getPanelBase = function () {
        return this.props.element || this.props.question;
    };
    SurveyPanelBase.prototype.getSurvey = function () {
        return (this.props.survey || (!!this.panelBase ? this.panelBase.survey : null));
    };
    SurveyPanelBase.prototype.getCss = function () {
        return this.props.css;
    };
    SurveyPanelBase.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.doAfterRender();
    };
    SurveyPanelBase.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        var el = this.rootRef.current;
        if (!!el) {
            el.removeAttribute("data-rendered");
        }
    };
    SurveyPanelBase.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (!!prevProps.page &&
            !!this.survey &&
            !!this.survey.activePage &&
            prevProps.page.id === this.survey.activePage.id)
            return;
        this.doAfterRender();
    };
    SurveyPanelBase.prototype.doAfterRender = function () {
        var el = this.rootRef.current;
        if (el && this.survey) {
            if (this.panelBase.isPanel) {
                this.panelBase.afterRender(el);
            }
            else {
                this.survey.afterRenderPage(el);
            }
        }
    };
    SurveyPanelBase.prototype.getIsVisible = function () {
        return this.panelBase.isVisible;
    };
    SurveyPanelBase.prototype.canRender = function () {
        return (_super.prototype.canRender.call(this) && !!this.survey && !!this.panelBase && !!this.panelBase.survey && this.getIsVisible());
    };
    SurveyPanelBase.prototype.renderRows = function (css) {
        var _this = this;
        return this.panelBase.visibleRows.map(function (row) { return _this.createRow(row, css); });
    };
    SurveyPanelBase.prototype.createRow = function (row, css) {
        return (_(row_SurveyRow, { key: row.id, row: row, survey: this.survey, creator: this.creator, css: css }));
    };
    return SurveyPanelBase;
}(reactquestion_element_SurveyElementBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/svg-icon/svg-icon.tsx
var svg_icon_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var svg_icon_SvgIcon = /** @class */ (function (_super) {
    svg_icon_extends(SvgIcon, _super);
    function SvgIcon(props) {
        var _this = _super.call(this, props) || this;
        _this.svgIconRef = xn.createRef();
        return _this;
    }
    SvgIcon.prototype.updateSvg = function () {
        if (this.props.iconName)
            Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["createSvg"])(this.props.size, this.props.width, this.props.height, this.props.iconName, this.svgIconRef.current, this.props.title);
    };
    SvgIcon.prototype.componentDidUpdate = function () {
        this.updateSvg();
    };
    SvgIcon.prototype.render = function () {
        var className = "sv-svg-icon";
        if (this.props.className) {
            className += " " + this.props.className;
        }
        return (this.props.iconName ?
            xn.createElement("svg", { className: className, style: this.props.style, onClick: this.props.onClick, ref: this.svgIconRef, role: "img" },
                xn.createElement("use", null))
            : null);
    };
    SvgIcon.prototype.componentDidMount = function () {
        this.updateSvg();
    };
    return SvgIcon;
}(xn.Component));

ReactElementFactory.Instance.registerElement("sv-svg-icon", function (props) {
    return xn.createElement(svg_icon_SvgIcon, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/action-bar/action-bar-separator.tsx
var action_bar_separator_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var action_bar_separator_SurveyActionBarSeparator = /** @class */ (function (_super) {
    action_bar_separator_extends(SurveyActionBarSeparator, _super);
    function SurveyActionBarSeparator(props) {
        return _super.call(this, props) || this;
    }
    SurveyActionBarSeparator.prototype.render = function () {
        var className = "sv-action-bar-separator " + this.props.cssClasses;
        return xn.createElement("div", { className: className });
    };
    return SurveyActionBarSeparator;
}(xn.Component));

ReactElementFactory.Instance.registerElement("sv-action-bar-separator", function (props) {
    return xn.createElement(action_bar_separator_SurveyActionBarSeparator, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/action-bar/action-bar-item.tsx
var action_bar_item_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var action_bar_item_SurveyAction = /** @class */ (function (_super) {
    action_bar_item_extends(SurveyAction, _super);
    function SurveyAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyAction.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyAction.prototype.getStateElement = function () {
        return this.item;
    };
    SurveyAction.prototype.renderElement = function () {
        //refactor
        var itemClass = this.item.getActionRootCss();
        var separator = this.item.needSeparator ? (xn.createElement(action_bar_separator_SurveyActionBarSeparator, null)) : null;
        var itemComponent = ReactElementFactory.Instance.createElement(this.item.component || "sv-action-bar-item", {
            item: this.item,
        });
        return (xn.createElement("div", { className: itemClass, id: this.item.id },
            xn.createElement("div", { className: "sv-action__content" },
                separator,
                itemComponent)));
    };
    return SurveyAction;
}(reactquestion_element_SurveyElementBase));

var action_bar_item_SurveyActionBarItem = /** @class */ (function (_super) {
    action_bar_item_extends(SurveyActionBarItem, _super);
    function SurveyActionBarItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyActionBarItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyActionBarItem.prototype.getStateElement = function () {
        return this.item;
    };
    SurveyActionBarItem.prototype.renderElement = function () {
        return xn.createElement(xn.Fragment, null, this.renderInnerButton());
    };
    SurveyActionBarItem.prototype.renderText = function () {
        if (!this.item.hasTitle)
            return null;
        var titleClass = this.item.getActionBarItemTitleCss();
        return xn.createElement("span", { className: titleClass }, this.item.title);
    };
    SurveyActionBarItem.prototype.renderButtonContent = function () {
        var text = this.renderText();
        var svgIcon = !!this.item.iconName ? (xn.createElement(svg_icon_SvgIcon, { className: this.item.cssClasses.itemIcon, size: this.item.iconSize, iconName: this.item.iconName, title: this.item.tooltip || this.item.title })) : null;
        return (xn.createElement(xn.Fragment, null,
            svgIcon,
            text));
    };
    SurveyActionBarItem.prototype.renderInnerButton = function () {
        var _this = this;
        var className = this.item.getActionBarItemCss();
        var title = this.item.tooltip || this.item.title;
        var buttonContent = this.renderButtonContent();
        var tabIndex = this.item.disableTabStop ? -1 : undefined;
        var button = attachKey2click(xn.createElement("button", { className: className, type: "button", disabled: this.item.disabled, onMouseDown: function (args) { return _this.item.doMouseDown(args); }, onFocus: function (args) { return _this.item.doFocus(args); }, onClick: function (args) { return _this.item.doAction(args); }, title: title, tabIndex: tabIndex, "aria-checked": this.item.ariaChecked, "aria-expanded": this.item.ariaExpanded, role: this.item.ariaRole }, buttonContent), this.item, { processEsc: false });
        return button;
    };
    return SurveyActionBarItem;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-action-bar-item", function (props) {
    return xn.createElement(action_bar_item_SurveyActionBarItem, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/popup/popup.tsx
var popup_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var popup_Popup = /** @class */ (function (_super) {
    popup_extends(Popup, _super);
    function Popup(props) {
        var _this = _super.call(this, props) || this;
        _this.containerRef = xn.createRef();
        _this.createModel();
        return _this;
    }
    Object.defineProperty(Popup.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Popup.prototype.getStateElement = function () {
        return this.model;
    };
    Popup.prototype.createModel = function () {
        this.popup = Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["createPopupViewModel"])(this.props.model, undefined);
    };
    Popup.prototype.setTargetElement = function () {
        var container = this.containerRef.current;
        this.popup.setComponentElement(container, this.props.getTarget ? this.props.getTarget(container) : undefined, this.props.getArea ? this.props.getArea(container) : undefined);
    };
    Popup.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.setTargetElement();
    };
    Popup.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.setTargetElement();
    };
    Popup.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.popup.resetComponentElement();
    };
    Popup.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var _a;
        if (!_super.prototype.shouldComponentUpdate.call(this, nextProps, nextState))
            return false;
        var isNeedUpdate = nextProps.model !== this.popup.model;
        if (isNeedUpdate) {
            (_a = this.popup) === null || _a === void 0 ? void 0 : _a.dispose();
            this.createModel();
        }
        return isNeedUpdate;
    };
    Popup.prototype.render = function () {
        this.popup.model = this.model;
        var popupContainer;
        if (this.model.isModal) {
            popupContainer = xn.createElement(popup_PopupContainer, { model: this.popup });
        }
        else {
            popupContainer = xn.createElement(popup_PopupDropdownContainer, { model: this.popup });
        }
        return xn.createElement("div", { ref: this.containerRef }, popupContainer);
    };
    return Popup;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-popup", function (props) {
    return xn.createElement(popup_Popup, props);
});
var popup_PopupContainer = /** @class */ (function (_super) {
    popup_extends(PopupContainer, _super);
    function PopupContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (event) {
            _this.model.onKeyDown(event);
        };
        _this.clickInside = function (ev) {
            ev.stopPropagation();
        };
        return _this;
    }
    Object.defineProperty(PopupContainer.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    PopupContainer.prototype.getStateElement = function () {
        return this.model;
    };
    PopupContainer.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (!this.model.isPositionSet && this.model.isVisible) {
            this.model.updateOnShowing();
        }
    };
    PopupContainer.prototype.renderContainer = function (popupBaseViewModel) {
        var _this = this;
        var headerPopup = popupBaseViewModel.showHeader ? this.renderHeaderPopup(popupBaseViewModel) : null;
        var headerContent = !!popupBaseViewModel.title ? this.renderHeaderContent() : null;
        var content = this.renderContent();
        var footerContent = popupBaseViewModel.showFooter ? this.renderFooter(this.model) : null;
        return (xn.createElement("div", { className: "sv-popup__container", style: {
                left: popupBaseViewModel.left,
                top: popupBaseViewModel.top,
                height: popupBaseViewModel.height,
                width: popupBaseViewModel.width,
                minWidth: popupBaseViewModel.minWidth,
            }, onClick: function (ev) {
                _this.clickInside(ev);
            } },
            headerPopup,
            xn.createElement("div", { className: "sv-popup__body-content" },
                headerContent,
                xn.createElement("div", { className: "sv-popup__scrolling-content" }, content),
                footerContent)));
    };
    PopupContainer.prototype.renderHeaderContent = function () {
        return xn.createElement("div", { className: "sv-popup__body-header" }, this.model.title);
    };
    PopupContainer.prototype.renderContent = function () {
        var contentComponent = ReactElementFactory.Instance.createElement(this.model.contentComponentName, this.model.contentComponentData);
        return xn.createElement("div", { className: "sv-popup__content" }, contentComponent);
    };
    PopupContainer.prototype.renderHeaderPopup = function (popupModel) {
        return null;
    };
    PopupContainer.prototype.renderFooter = function (popuModel) {
        return (xn.createElement("div", { className: "sv-popup__body-footer" },
            xn.createElement(action_bar_SurveyActionBar, { model: popuModel.footerToolbar })));
    };
    PopupContainer.prototype.render = function () {
        var _this = this;
        var container = this.renderContainer(this.model);
        var className = new external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["CssClassBuilder"]()
            .append("sv-popup")
            .append(this.model.styleClass)
            .toString();
        var style = { display: this.model.isVisible ? "" : "none", };
        return (xn.createElement("div", { tabIndex: -1, className: className, style: style, onClick: function (e) {
                _this.model.clickOutside(e);
            }, onKeyDown: this.handleKeydown }, container));
    };
    PopupContainer.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (this.model.isVisible) {
            this.model.updateOnShowing();
        }
    };
    return PopupContainer;
}(reactquestion_element_SurveyElementBase));

var popup_PopupDropdownContainer = /** @class */ (function (_super) {
    popup_extends(PopupDropdownContainer, _super);
    function PopupDropdownContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PopupDropdownContainer.prototype.renderHeaderPopup = function (popupModel) {
        var popupDropdownModel = popupModel;
        if (!popupDropdownModel)
            return null;
        return (xn.createElement("span", { style: {
                left: popupDropdownModel.pointerTarget.left,
                top: popupDropdownModel.pointerTarget.top,
            }, className: "sv-popup__pointer" }));
    };
    return PopupDropdownContainer;
}(popup_PopupContainer));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/action-bar/action-bar-item-dropdown.tsx
var action_bar_item_dropdown_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var action_bar_item_dropdown_SurveyActionBarItemDropdown = /** @class */ (function (_super) {
    action_bar_item_dropdown_extends(SurveyActionBarItemDropdown, _super);
    function SurveyActionBarItemDropdown(props) {
        return _super.call(this, props) || this;
    }
    SurveyActionBarItemDropdown.prototype.renderInnerButton = function () {
        var button = _super.prototype.renderInnerButton.call(this);
        return (xn.createElement(xn.Fragment, null,
            button,
            xn.createElement(popup_Popup, { model: this.item.popupModel, getTarget: external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["getActionDropdownButtonTarget"] })));
    };
    SurveyActionBarItemDropdown.prototype.componentDidMount = function () {
        this.viewModel = new external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["ActionDropdownViewModel"](this.item);
    };
    SurveyActionBarItemDropdown.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.viewModel.dispose();
    };
    return SurveyActionBarItemDropdown;
}(action_bar_item_SurveyActionBarItem));

ReactElementFactory.Instance.registerElement("sv-action-bar-item-dropdown", function (props) {
    return xn.createElement(action_bar_item_dropdown_SurveyActionBarItemDropdown, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/action-bar/action-bar.tsx
var action_bar_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var action_bar_SurveyActionBar = /** @class */ (function (_super) {
    action_bar_extends(SurveyActionBar, _super);
    function SurveyActionBar(props) {
        var _this = _super.call(this, props) || this;
        _this.rootRef = xn.createRef();
        return _this;
    }
    Object.defineProperty(SurveyActionBar.prototype, "handleClick", {
        get: function () {
            return this.props.handleClick !== undefined ? this.props.handleClick : true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyActionBar.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    SurveyActionBar.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (!this.model.hasActions)
            return;
        var container = this.rootRef.current;
        if (!!container) {
            this.model.initResponsivityManager(container, function (callback) { setTimeout(callback); });
        }
    };
    SurveyActionBar.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (!!this.model.hasActions) {
            this.model.resetResponsivityManager();
        }
    };
    SurveyActionBar.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (prevProps.model == this.props.model) {
            return;
        }
        if (!!this.model.hasActions) {
            this.model.resetResponsivityManager();
            var container = this.rootRef.current;
            if (!!container) {
                this.model.initResponsivityManager(container, function (callback) { setTimeout(callback); });
            }
        }
    };
    SurveyActionBar.prototype.getStateElement = function () {
        return this.model;
    };
    SurveyActionBar.prototype.renderElement = function () {
        if (!this.model.hasActions)
            return null;
        var items = this.renderItems();
        return (xn.createElement("div", { ref: this.rootRef, className: this.model.getRootCss(), onClick: this.handleClick ? function (event) {
                event.stopPropagation();
            } : undefined }, items));
    };
    SurveyActionBar.prototype.renderItems = function () {
        return this.model.renderedActions.map(function (item, itemIndex) {
            return (xn.createElement(action_bar_item_SurveyAction, { item: item, key: "item" + itemIndex }));
        });
    };
    return SurveyActionBar;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-action-bar", function (props) {
    return xn.createElement(action_bar_SurveyActionBar, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/title/title-content.tsx
var title_content_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var title_content_TitleContent = /** @class */ (function (_super) {
    title_content_extends(TitleContent, _super);
    function TitleContent(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(TitleContent.prototype, "cssClasses", {
        get: function () {
            return this.props.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TitleContent.prototype, "element", {
        get: function () {
            return this.props.element;
        },
        enumerable: false,
        configurable: true
    });
    TitleContent.prototype.render = function () {
        if (this.element.isTitleRenderedAsString)
            return reactquestion_element_SurveyElementBase.renderLocString(this.element.locTitle);
        var spans = this.renderTitleSpans(this.element.getTitleOwner(), this.cssClasses);
        return xn.createElement(xn.Fragment, null, spans);
    };
    TitleContent.prototype.renderTitleSpans = function (element, cssClasses) {
        var getSpaceSpan = function (key) {
            return (xn.createElement("span", { "data-key": key, key: key }, "\u00A0"));
        };
        var spans = [];
        if (element.isRequireTextOnStart) {
            spans.push(this.renderRequireText(element));
            spans.push(getSpaceSpan("req-sp"));
        }
        var questionNumber = element.no;
        if (questionNumber) {
            spans.push(xn.createElement("span", { "data-key": "q_num", key: "q_num", className: element.cssTitleNumber, style: { position: "static" }, "aria-hidden": true }, questionNumber));
            spans.push(getSpaceSpan("num-sp"));
        }
        if (element.isRequireTextBeforeTitle) {
            spans.push(this.renderRequireText(element));
            spans.push(getSpaceSpan("req-sp"));
        }
        spans.push(reactquestion_element_SurveyElementBase.renderLocString(element.locTitle, null, "q_title"));
        if (element.isRequireTextAfterTitle) {
            spans.push(getSpaceSpan("req-sp"));
            spans.push(this.renderRequireText(element));
        }
        return spans;
    };
    TitleContent.prototype.renderRequireText = function (element) {
        return (xn.createElement("span", { "data-key": "req-text", key: "req-text", className: element.cssRequiredText, "aria-hidden": true }, element.requiredText));
    };
    return TitleContent;
}(xn.Component));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/title/title-actions.tsx
var title_actions_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var title_actions_TitleActions = /** @class */ (function (_super) {
    title_actions_extends(TitleActions, _super);
    function TitleActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TitleActions.prototype, "cssClasses", {
        get: function () {
            return this.props.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TitleActions.prototype, "element", {
        get: function () {
            return this.props.element;
        },
        enumerable: false,
        configurable: true
    });
    TitleActions.prototype.render = function () {
        var titleContent = xn.createElement(title_content_TitleContent, { element: this.element, cssClasses: this.cssClasses });
        if (!this.element.hasTitleActions)
            return titleContent;
        return (xn.createElement("div", { className: "sv-title-actions" },
            xn.createElement("span", { className: "sv-title-actions__title" }, titleContent),
            xn.createElement(action_bar_SurveyActionBar, { model: this.element.getTitleToolbar() })));
    };
    return TitleActions;
}(xn.Component));

external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["RendererFactory"].Instance.registerRenderer("element", "title-actions", "sv-title-actions");
ReactElementFactory.Instance.registerElement("sv-title-actions", function (props) {
    return xn.createElement(title_actions_TitleActions, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/title/title-element.tsx
var title_element_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var title_element_TitleElement = /** @class */ (function (_super) {
    title_element_extends(TitleElement, _super);
    function TitleElement(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(TitleElement.prototype, "element", {
        get: function () {
            return this.props.element;
        },
        enumerable: false,
        configurable: true
    });
    TitleElement.prototype.renderTitleExpandableSvg = function () {
        if (!this.element.getCssTitleExpandableSvg())
            return null;
        var iconName = this.element.isExpanded ? "icon-collapse-16x16" : "icon-expand-16x16";
        return xn.createElement(svg_icon_SvgIcon, { className: this.element.getCssTitleExpandableSvg(), iconName: iconName, size: 16 });
    };
    TitleElement.prototype.render = function () {
        var element = this.element;
        if (!element || !element.hasTitle)
            return null;
        var ariaLabel = element.titleAriaLabel || undefined;
        var titleExpandableSvg = this.renderTitleExpandableSvg();
        var titleContent = (xn.createElement(title_actions_TitleActions, { element: element, cssClasses: element.cssClasses }));
        var onClick = undefined;
        var onKeyUp = undefined;
        if (element.hasTitleEvents) {
            onKeyUp = function (evt) {
                Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["doKey2ClickUp"])(evt.nativeEvent);
            };
        }
        var CustomTag = element.titleTagName;
        return (xn.createElement(CustomTag, { className: element.cssTitle, id: element.ariaTitleId, "aria-label": ariaLabel, tabIndex: element.titleTabIndex, "aria-expanded": element.titleAriaExpanded, role: element.titleAriaRole, onClick: onClick, onKeyUp: onKeyUp },
            titleExpandableSvg,
            titleContent));
    };
    return TitleElement;
}(xn.Component));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_factory.tsx
var ReactQuestionFactory = /** @class */ (function () {
    function ReactQuestionFactory() {
        this.creatorHash = {};
    }
    ReactQuestionFactory.prototype.registerQuestion = function (questionType, questionCreator) {
        this.creatorHash[questionType] = questionCreator;
    };
    ReactQuestionFactory.prototype.getAllTypes = function () {
        var result = new Array();
        for (var key in this.creatorHash) {
            result.push(key);
        }
        return result.sort();
    };
    ReactQuestionFactory.prototype.createQuestion = function (questionType, params) {
        var creator = this.creatorHash[questionType];
        if (creator == null)
            return null;
        return creator(params);
    };
    ReactQuestionFactory.Instance = new ReactQuestionFactory();
    return ReactQuestionFactory;
}());


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/character-counter.tsx
var character_counter_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var character_counter_CharacterCounterComponent = /** @class */ (function (_super) {
    character_counter_extends(CharacterCounterComponent, _super);
    function CharacterCounterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CharacterCounterComponent.prototype.getStateElement = function () {
        return this.props.counter;
    };
    CharacterCounterComponent.prototype.renderElement = function () {
        return (xn.createElement("div", { className: this.props.remainingCharacterCounter }, this.props.counter.remainingCharacterCounter));
    };
    return CharacterCounterComponent;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-character-counter", function (props) {
    return xn.createElement(character_counter_CharacterCounterComponent, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/text-area.tsx
var text_area_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var text_area_TextAreaComponent = /** @class */ (function (_super) {
    text_area_extends(TextAreaComponent, _super);
    function TextAreaComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.initialValue = _this.viewModel.getTextValue() || "";
        return _this;
    }
    Object.defineProperty(TextAreaComponent.prototype, "viewModel", {
        get: function () {
            return this.props.viewModel;
        },
        enumerable: false,
        configurable: true
    });
    TextAreaComponent.prototype.canRender = function () {
        return !!this.viewModel.question;
    };
    TextAreaComponent.prototype.renderElement = function () {
        var _this = this;
        return (xn.createElement("textarea", { id: this.viewModel.id, className: this.viewModel.className, ref: function (textarea) { return (_this.viewModel.setElement(textarea)); }, disabled: this.viewModel.isDisabledAttr, readOnly: this.viewModel.isReadOnlyAttr, rows: this.viewModel.rows, cols: this.viewModel.cols, placeholder: this.viewModel.placeholder, maxLength: this.viewModel.maxLength, defaultValue: this.initialValue, onChange: function (event) { _this.viewModel.onTextAreaInput(event); }, onFocus: function (event) { _this.viewModel.onTextAreaFocus(event); }, onBlur: function (event) { _this.viewModel.onTextAreaBlur(event); }, onKeyDown: function (event) { _this.viewModel.onTextAreaKeyDown(event); }, "aria-required": this.viewModel.ariaRequired, "aria-label": this.viewModel.ariaLabel, "aria-labelledby": this.viewModel.ariaLabelledBy, "aria-describedby": this.viewModel.ariaDescribedBy, "aria-invalid": this.viewModel.ariaInvalid, "aria-errormessage": this.viewModel.ariaErrormessage, style: { resize: this.viewModel.question.resizeStyle } }));
    };
    return TextAreaComponent;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-text-area", function (props) {
    return xn.createElement(text_area_TextAreaComponent, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_comment.tsx
var reactquestion_comment_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var reactquestion_comment_SurveyQuestionComment = /** @class */ (function (_super) {
    reactquestion_comment_extends(SurveyQuestionComment, _super);
    function SurveyQuestionComment(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionComment.prototype.renderCharacterCounter = function () {
        var counter = null;
        if (!!this.question.getMaxLength()) {
            counter = _(character_counter_CharacterCounterComponent, { counter: this.question.characterCounter, remainingCharacterCounter: this.question.cssClasses.remainingCharacterCounter });
        }
        return counter;
    };
    SurveyQuestionComment.prototype.renderElement = function () {
        if (this.question.isReadOnlyRenderDiv()) {
            return _("div", null, this.question.value);
        }
        var counter = this.renderCharacterCounter();
        var textAreaModel = this.props.question.textAreaModel;
        return (_(b, null,
            _(text_area_TextAreaComponent, { viewModel: textAreaModel }),
            counter));
    };
    return SurveyQuestionComment;
}(reactquestion_element_SurveyQuestionUncontrolledElement));

var reactquestion_comment_SurveyQuestionCommentItem = /** @class */ (function (_super) {
    reactquestion_comment_extends(SurveyQuestionCommentItem, _super);
    function SurveyQuestionCommentItem(props) {
        var _this = _super.call(this, props) || this;
        _this.textAreaModel = _this.getTextAreaModel();
        return _this;
    }
    SurveyQuestionCommentItem.prototype.canRender = function () {
        return !!this.props.question;
    };
    SurveyQuestionCommentItem.prototype.getTextAreaModel = function () {
        return this.props.question.commentTextAreaModel;
    };
    SurveyQuestionCommentItem.prototype.renderElement = function () {
        var question = this.props.question;
        if (question.isReadOnlyRenderDiv()) {
            var comment = this.textAreaModel.getTextValue() || "";
            return _("div", null, comment);
        }
        return (_(text_area_TextAreaComponent, { viewModel: this.textAreaModel }));
    };
    return SurveyQuestionCommentItem;
}(ReactSurveyElement));

var SurveyQuestionOtherValueItem = /** @class */ (function (_super) {
    reactquestion_comment_extends(SurveyQuestionOtherValueItem, _super);
    function SurveyQuestionOtherValueItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SurveyQuestionOtherValueItem.prototype.getTextAreaModel = function () {
        return this.props.question.otherTextAreaModel;
    };
    return SurveyQuestionOtherValueItem;
}(reactquestion_comment_SurveyQuestionCommentItem));

ReactQuestionFactory.Instance.registerQuestion("comment", function (props) {
    return _(reactquestion_comment_SurveyQuestionComment, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/custom-widget.tsx
var custom_widget_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var custom_widget_SurveyCustomWidget = /** @class */ (function (_super) {
    custom_widget_extends(SurveyCustomWidget, _super);
    function SurveyCustomWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.widgetRef = m();
        return _this;
    }
    SurveyCustomWidget.prototype._afterRender = function () {
        if (this.questionBase.customWidget) {
            var el = this.widgetRef.current;
            if (!!el) {
                this.questionBase.customWidget.afterRender(this.questionBase, el);
                this.questionBase.customWidgetData.isNeedRender = false;
            }
        }
    };
    SurveyCustomWidget.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (this.questionBase) {
            this._afterRender();
        }
    };
    SurveyCustomWidget.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        var isDefaultRender = !!this.questionBase.customWidget &&
            this.questionBase.customWidget.isDefaultRender;
        if (this.questionBase && !isDefaultRender) {
            this._afterRender();
        }
    };
    SurveyCustomWidget.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (this.questionBase.customWidget) {
            var el = this.widgetRef.current;
            if (!!el) {
                this.questionBase.customWidget.willUnmount(this.questionBase, el);
            }
        }
    };
    SurveyCustomWidget.prototype.canRender = function () {
        return _super.prototype.canRender.call(this) && this.questionBase.visible;
    };
    SurveyCustomWidget.prototype.renderElement = function () {
        var customWidget = this.questionBase.customWidget;
        if (customWidget.isDefaultRender) {
            return (_("div", { ref: this.widgetRef }, this.creator.createQuestionElement(this.questionBase)));
        }
        var widget = null;
        if (customWidget.widgetJson.render) {
            widget = customWidget.widgetJson.render(this.questionBase);
        }
        else {
            if (customWidget.htmlTemplate) {
                var htmlValue = { __html: customWidget.htmlTemplate };
                return _("div", { ref: this.widgetRef, dangerouslySetInnerHTML: htmlValue });
            }
        }
        return _("div", { ref: this.widgetRef }, widget);
    };
    return SurveyCustomWidget;
}(reactquestion_element_SurveyQuestionElementBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/element-header.tsx
var element_header_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var element_header_SurveyElementHeader = /** @class */ (function (_super) {
    element_header_extends(SurveyElementHeader, _super);
    function SurveyElementHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyElementHeader.prototype, "element", {
        get: function () {
            return this.props.element;
        },
        enumerable: false,
        configurable: true
    });
    SurveyElementHeader.prototype.render = function () {
        var element = this.element;
        var title = element.hasTitle ? (xn.createElement(title_element_TitleElement, { element: element })) : null;
        var description = element.hasDescriptionUnderTitle
            ? reactquestion_element_SurveyElementBase.renderQuestionDescription(this.element)
            : null;
        var additionalTitleToolbarElement = element.hasAdditionalTitleToolbar ? xn.createElement(action_bar_SurveyActionBar, { model: element.additionalTitleToolbar }) : null;
        var headerStyle = { width: undefined };
        if (element instanceof external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["Question"]) {
            headerStyle.width = element.titleWidth;
        }
        return (xn.createElement("div", { className: element.cssHeader, onClick: function (e) { return element.clickTitleFunction && element.clickTitleFunction(e.nativeEvent); }, style: headerStyle },
            title,
            description,
            additionalTitleToolbarElement));
    };
    return SurveyElementHeader;
}(xn.Component));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion.tsx
var reactquestion_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







var reactquestion_SurveyQuestion = /** @class */ (function (_super) {
    reactquestion_extends(SurveyQuestion, _super);
    function SurveyQuestion(props) {
        var _this = _super.call(this, props) || this;
        _this.isNeedFocus = false;
        _this.rootRef = m();
        return _this;
    }
    SurveyQuestion.renderQuestionBody = function (creator, question) {
        // if (!question.isVisible) return null;
        var customWidget = question.customWidget;
        if (!customWidget) {
            return creator.createQuestionElement(question);
        }
        return _(custom_widget_SurveyCustomWidget, { creator: creator, question: question });
    };
    SurveyQuestion.prototype.getStateElement = function () {
        return this.question;
    };
    Object.defineProperty(SurveyQuestion.prototype, "question", {
        get: function () {
            return this.props.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestion.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestion.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (!!this.question) {
            this.question["react"] = this;
        }
        this.doAfterRender();
    };
    SurveyQuestion.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (!!this.question) {
            this.question["react"] = null;
        }
        var el = this.rootRef.current;
        if (!!el) {
            el.removeAttribute("data-rendered");
        }
    };
    SurveyQuestion.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.doAfterRender();
    };
    SurveyQuestion.prototype.doAfterRender = function () {
        if (this.isNeedFocus) {
            if (!this.question.isCollapsed) {
                this.question.clickTitleFunction();
            }
            this.isNeedFocus = false;
        }
        if (this.question) {
            var el = this.rootRef.current;
            if (el && el.getAttribute("data-rendered") !== "r") {
                el.setAttribute("data-rendered", "r");
                el.setAttribute("data-name", this.question.name);
                if (this.question.afterRender) {
                    this.question.afterRender(el);
                }
            }
        }
    };
    SurveyQuestion.prototype.canRender = function () {
        return (_super.prototype.canRender.call(this) &&
            !!this.question &&
            !!this.creator);
    };
    SurveyQuestion.prototype.renderQuestionContent = function () {
        var question = this.question;
        var contentStyle = {
            display: this.question.renderedIsExpanded ? "" : "none",
        };
        var cssClasses = question.cssClasses;
        var questionRender = this.renderQuestion();
        var errorsTop = this.question.showErrorOnTop
            ? this.renderErrors(cssClasses, "top")
            : null;
        var errorsBottom = this.question.showErrorOnBottom
            ? this.renderErrors(cssClasses, "bottom")
            : null;
        var comment = question && question.hasComment ? this.renderComment(cssClasses) : null;
        var descriptionUnderInput = question.hasDescriptionUnderInput
            ? this.renderDescription()
            : null;
        return (_("div", { className: question.cssContent || undefined, style: contentStyle, role: "presentation" },
            errorsTop,
            questionRender,
            comment,
            errorsBottom,
            descriptionUnderInput));
    };
    SurveyQuestion.prototype.renderElement = function () {
        var question = this.question;
        var cssClasses = question.cssClasses;
        var header = this.renderHeader(question);
        var headerTop = question.hasTitleOnLeftTop ? header : null;
        var headerBottom = question.hasTitleOnBottom ? header : null;
        var errorsAboveQuestion = this.question.showErrorsAboveQuestion
            ? this.renderErrors(cssClasses, "")
            : null;
        var errorsBelowQuestion = this.question.showErrorsBelowQuestion
            ? this.renderErrors(cssClasses, "")
            : null;
        var rootStyle = question.getRootStyle();
        var questionContent = this.wrapQuestionContent(this.renderQuestionContent());
        return (_(b, null,
            _("div", { ref: this.rootRef, id: question.id, className: question.getRootCss(), style: rootStyle, role: question.ariaRole, "aria-required": this.question.ariaRequired, "aria-invalid": this.question.ariaInvalid, "aria-labelledby": question.ariaLabelledBy, "aria-describedby": question.ariaDescribedBy, "aria-expanded": question.ariaExpanded },
                errorsAboveQuestion,
                headerTop,
                questionContent,
                headerBottom,
                errorsBelowQuestion)));
    };
    SurveyQuestion.prototype.wrapElement = function (element) {
        var survey = this.question.survey;
        var wrapper = null;
        if (survey) {
            wrapper = reactsurveymodel_ReactSurveyElementsWrapper.wrapElement(survey, element, this.question);
        }
        return wrapper !== null && wrapper !== void 0 ? wrapper : element;
    };
    SurveyQuestion.prototype.wrapQuestionContent = function (element) {
        var survey = this.question.survey;
        var wrapper = null;
        if (survey) {
            wrapper = reactsurveymodel_ReactSurveyElementsWrapper.wrapQuestionContent(survey, element, this.question);
        }
        return wrapper !== null && wrapper !== void 0 ? wrapper : element;
    };
    SurveyQuestion.prototype.renderQuestion = function () {
        return SurveyQuestion.renderQuestionBody(this.creator, this.question);
    };
    SurveyQuestion.prototype.renderDescription = function () {
        return reactquestion_element_SurveyElementBase.renderQuestionDescription(this.question);
    };
    SurveyQuestion.prototype.renderComment = function (cssClasses) {
        var commentText = reactquestion_element_SurveyElementBase.renderLocString(this.question.locCommentText);
        return (_("div", { className: this.question.getCommentAreaCss() },
            _("div", null, commentText),
            _(reactquestion_comment_SurveyQuestionCommentItem, { question: this.question, cssClasses: cssClasses, otherCss: cssClasses.other, isDisplayMode: this.question.isInputReadOnly })));
    };
    SurveyQuestion.prototype.renderHeader = function (question) {
        return _(element_header_SurveyElementHeader, { element: question });
    };
    SurveyQuestion.prototype.renderErrors = function (cssClasses, location) {
        return (_(reactquestion_SurveyElementErrors, { element: this.question, cssClasses: cssClasses, creator: this.creator, location: location, id: this.question.id + "_errors" }));
    };
    return SurveyQuestion;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("question", function (props) {
    return _(reactquestion_SurveyQuestion, props);
});
var reactquestion_SurveyElementErrors = /** @class */ (function (_super) {
    reactquestion_extends(SurveyElementErrors, _super);
    function SurveyElementErrors(props) {
        var _this = _super.call(this, props) || this;
        _this.state = _this.getState();
        return _this;
    }
    Object.defineProperty(SurveyElementErrors.prototype, "id", {
        get: function () {
            return this.props.element.id + "_errors";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyElementErrors.prototype, "element", {
        get: function () {
            return this.props.element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyElementErrors.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyElementErrors.prototype, "location", {
        get: function () {
            return this.props.location;
        },
        enumerable: false,
        configurable: true
    });
    SurveyElementErrors.prototype.getState = function (prevState) {
        if (prevState === void 0) { prevState = null; }
        return !prevState ? { error: 0 } : { error: prevState.error + 1 };
    };
    SurveyElementErrors.prototype.canRender = function () {
        return !!this.element && this.element.hasVisibleErrors;
    };
    SurveyElementErrors.prototype.componentWillUnmount = function () {
    };
    SurveyElementErrors.prototype.renderElement = function () {
        var errors = [];
        for (var i = 0; i < this.element.errors.length; i++) {
            var key = "error" + i;
            errors.push(this.creator.renderError(key, this.element.errors[i], this.cssClasses, this.element));
        }
        return (_("div", { role: "alert", "aria-live": "polite", className: this.element.cssError, id: this.id }, errors));
    };
    return SurveyElementErrors;
}(ReactSurveyElement));

var reactquestion_SurveyQuestionAndErrorsWrapped = /** @class */ (function (_super) {
    reactquestion_extends(SurveyQuestionAndErrorsWrapped, _super);
    function SurveyQuestionAndErrorsWrapped(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionAndErrorsWrapped.prototype.getStateElement = function () {
        return this.question;
    };
    Object.defineProperty(SurveyQuestionAndErrorsWrapped.prototype, "question", {
        get: function () {
            return this.getQuestion();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionAndErrorsWrapped.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionAndErrorsWrapped.prototype.getQuestion = function () {
        return this.props.question;
    };
    Object.defineProperty(SurveyQuestionAndErrorsWrapped.prototype, "itemCss", {
        get: function () {
            return this.props.itemCss;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionAndErrorsWrapped.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.doAfterRender();
    };
    SurveyQuestionAndErrorsWrapped.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.doAfterRender();
    };
    SurveyQuestionAndErrorsWrapped.prototype.doAfterRender = function () { };
    SurveyQuestionAndErrorsWrapped.prototype.canRender = function () {
        return !!this.question;
    };
    SurveyQuestionAndErrorsWrapped.prototype.renderContent = function () {
        var renderedQuestion = this.renderQuestion();
        return (_(b, null, renderedQuestion));
    };
    SurveyQuestionAndErrorsWrapped.prototype.getShowErrors = function () {
        return this.question.isVisible;
    };
    SurveyQuestionAndErrorsWrapped.prototype.renderQuestion = function () {
        return reactquestion_SurveyQuestion.renderQuestionBody(this.creator, this.question);
    };
    return SurveyQuestionAndErrorsWrapped;
}(ReactSurveyElement));

var reactquestion_SurveyQuestionAndErrorsCell = /** @class */ (function (_super) {
    reactquestion_extends(SurveyQuestionAndErrorsCell, _super);
    function SurveyQuestionAndErrorsCell(props) {
        var _this = _super.call(this, props) || this;
        _this.cellRef = m();
        return _this;
    }
    SurveyQuestionAndErrorsCell.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (this.question) {
            var el = this.cellRef.current;
            if (!!el) {
                el.removeAttribute("data-rendered");
            }
        }
    };
    SurveyQuestionAndErrorsCell.prototype.renderCellContent = function () {
        return (_("div", { className: this.props.cell.cellQuestionWrapperClassName }, this.renderQuestion()));
    };
    SurveyQuestionAndErrorsCell.prototype.renderElement = function () {
        var style = this.getCellStyle();
        var cell = this.props.cell;
        var focusIn = function () { cell.focusIn(); };
        return (_("td", { ref: this.cellRef, className: this.itemCss, colSpan: cell.colSpans, title: cell.getTitle(), style: style, onFocus: focusIn }, this.wrapCell(this.props.cell, this.renderCellContent())));
    };
    SurveyQuestionAndErrorsCell.prototype.getCellStyle = function () {
        return null;
    };
    SurveyQuestionAndErrorsCell.prototype.getHeaderText = function () {
        return "";
    };
    SurveyQuestionAndErrorsCell.prototype.wrapCell = function (cell, element) {
        if (!cell) {
            return element;
        }
        var survey = this.question.survey;
        var wrapper = null;
        if (survey) {
            wrapper = reactsurveymodel_ReactSurveyElementsWrapper.wrapMatrixCell(survey, element, cell, this.props.reason);
        }
        return wrapper !== null && wrapper !== void 0 ? wrapper : element;
    };
    return SurveyQuestionAndErrorsCell;
}(reactquestion_SurveyQuestionAndErrorsWrapped));

var reactquestion_SurveyQuestionErrorCell = /** @class */ (function (_super) {
    reactquestion_extends(SurveyQuestionErrorCell, _super);
    function SurveyQuestionErrorCell(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            changed: 0
        };
        if (_this.question) {
            _this.registerCallback(_this.question);
        }
        return _this;
    }
    Object.defineProperty(SurveyQuestionErrorCell.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionErrorCell.prototype.update = function () {
        this.setState({ changed: this.state.changed + 1 });
    };
    SurveyQuestionErrorCell.prototype.getQuestionPropertiesToTrack = function () {
        return ["errors"];
    };
    SurveyQuestionErrorCell.prototype.registerCallback = function (question) {
        var _this = this;
        question.registerFunctionOnPropertiesValueChanged(this.getQuestionPropertiesToTrack(), function () {
            _this.update();
        }, "__reactSubscription");
    };
    SurveyQuestionErrorCell.prototype.unRegisterCallback = function (question) {
        question.unRegisterFunctionOnPropertiesValueChanged(this.getQuestionPropertiesToTrack(), "__reactSubscription");
    };
    SurveyQuestionErrorCell.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.question && prevProps.question !== this.question) {
            this.unRegisterCallback(prevProps.cell);
        }
        if (this.question) {
            this.registerCallback(this.question);
        }
    };
    SurveyQuestionErrorCell.prototype.componentWillUnmount = function () {
        if (this.question) {
            this.unRegisterCallback(this.question);
        }
    };
    SurveyQuestionErrorCell.prototype.render = function () {
        return _(reactquestion_SurveyElementErrors, { element: this.question, creator: this.props.creator, cssClasses: this.question.cssClasses });
    };
    return SurveyQuestionErrorCell;
}(k));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/page.tsx
var page_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var page_SurveyPage = /** @class */ (function (_super) {
    page_extends(SurveyPage, _super);
    function SurveyPage(props) {
        return _super.call(this, props) || this;
    }
    SurveyPage.prototype.getPanelBase = function () {
        return this.props.page;
    };
    Object.defineProperty(SurveyPage.prototype, "page", {
        get: function () {
            return this.panelBase;
        },
        enumerable: false,
        configurable: true
    });
    // shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    //   if(!super.shouldComponentUpdate(nextProps, nextState)) return false;
    //   return true;
    // }
    SurveyPage.prototype.renderElement = function () {
        var title = this.renderTitle();
        var description = this.renderDescription();
        var rows = this.renderRows(this.panelBase.cssClasses);
        var errors = (_(reactquestion_SurveyElementErrors, { element: this.panelBase, cssClasses: this.panelBase.cssClasses, creator: this.creator }));
        return (_("div", { ref: this.rootRef, className: this.page.cssRoot },
            title,
            description,
            errors,
            rows));
    };
    SurveyPage.prototype.renderTitle = function () {
        return _(title_element_TitleElement, { element: this.page });
    };
    SurveyPage.prototype.renderDescription = function () {
        if (!this.page._showDescription)
            return null;
        var text = reactquestion_element_SurveyElementBase.renderLocString(this.page.locDescription);
        return (_("div", { className: this.panelBase.cssClasses.page.description }, text));
    };
    return SurveyPage;
}(panel_base_SurveyPanelBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/survey-header/survey-header.tsx
var survey_header_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var survey_header_SurveyHeader = /** @class */ (function (_super) {
    survey_header_extends(SurveyHeader, _super);
    function SurveyHeader(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { changed: 0 };
        _this.rootRef = xn.createRef();
        return _this;
    }
    Object.defineProperty(SurveyHeader.prototype, "survey", {
        get: function () {
            return this.props.survey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyHeader.prototype, "css", {
        get: function () {
            return this.survey.css;
        },
        enumerable: false,
        configurable: true
    });
    SurveyHeader.prototype.componentDidMount = function () {
        var self = this;
        this.survey.afterRenderHeader(this.rootRef.current);
        this.survey.locLogo.onChanged = function () {
            self.setState({ changed: self.state.changed + 1 });
        };
    };
    SurveyHeader.prototype.componentWillUnmount = function () {
        this.survey.locLogo.onChanged = function () { };
    };
    SurveyHeader.prototype.renderTitle = function () {
        if (!this.survey.renderedHasTitle)
            return null;
        var description = reactquestion_element_SurveyElementBase.renderLocString(this.survey.locDescription);
        return (xn.createElement("div", { className: this.css.headerText, style: { maxWidth: this.survey.titleMaxWidth } },
            xn.createElement(title_element_TitleElement, { element: this.survey }),
            this.survey.renderedHasDescription ? xn.createElement("div", { className: this.css.description }, description) : null));
    };
    SurveyHeader.prototype.renderLogoImage = function (isRender) {
        if (!isRender)
            return null;
        var componentName = this.survey.getElementWrapperComponentName(this.survey, "logo-image");
        var componentData = this.survey.getElementWrapperComponentData(this.survey, "logo-image");
        return ReactElementFactory.Instance.createElement(componentName, {
            data: componentData,
        });
    };
    SurveyHeader.prototype.render = function () {
        if (!this.survey.renderedHasHeader)
            return null;
        return (xn.createElement("div", { className: this.css.header, ref: this.rootRef },
            this.renderLogoImage(this.survey.isLogoBefore),
            this.renderTitle(),
            this.renderLogoImage(this.survey.isLogoAfter),
            xn.createElement("div", { className: this.css.headerClose })));
    };
    return SurveyHeader;
}(xn.Component));

ReactElementFactory.Instance.registerElement("survey-header", function (props) {
    return xn.createElement(survey_header_SurveyHeader, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/brand-info.tsx
var brand_info_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var brand_info_BrandInfo = /** @class */ (function (_super) {
    brand_info_extends(BrandInfo, _super);
    function BrandInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrandInfo.prototype.render = function () {
        return (xn.createElement("div", { className: "sv-brand-info" },
            xn.createElement("a", { className: "sv-brand-info__logo", href: "https://surveyjs.io/?utm_source=built-in_links&utm_medium=online_survey_tool&utm_campaign=landing_page" },
                xn.createElement("img", { src: "https://surveyjs.io/Content/Images/poweredby.svg" })),
            xn.createElement("div", { className: "sv-brand-info__text" },
                "Try and see how easy it is to ",
                xn.createElement("a", { href: "https://surveyjs.io/create-survey?utm_source=built-in_links&utm_medium=online_survey_tool&utm_campaign=create_survey" }, "create a survey")),
            xn.createElement("div", { className: "sv-brand-info__terms" },
                xn.createElement("a", { href: "https://surveyjs.io/TermsOfUse" }, "Terms of Use & Privacy Statement"))));
    };
    return BrandInfo;
}(xn.Component));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/notifier.tsx
var notifier_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var notifier_NotifierComponent = /** @class */ (function (_super) {
    notifier_extends(NotifierComponent, _super);
    function NotifierComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NotifierComponent.prototype, "notifier", {
        get: function () {
            return this.props.notifier;
        },
        enumerable: false,
        configurable: true
    });
    NotifierComponent.prototype.getStateElement = function () {
        return this.notifier;
    };
    NotifierComponent.prototype.renderElement = function () {
        if (!this.notifier.isDisplayed)
            return null;
        var style = { visibility: this.notifier.active ? "visible" : "hidden" };
        return (xn.createElement("div", { className: this.notifier.css, style: style, role: "alert", "aria-live": "polite" },
            xn.createElement("span", null, this.notifier.message),
            xn.createElement(action_bar_SurveyActionBar, { model: this.notifier.actionBar })));
    };
    return NotifierComponent;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-notifier", function (props) {
    return xn.createElement(notifier_NotifierComponent, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/components-container.tsx
var components_container_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var components_container_ComponentsContainer = /** @class */ (function (_super) {
    components_container_extends(ComponentsContainer, _super);
    function ComponentsContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComponentsContainer.prototype.render = function () {
        var _this = this;
        var components = this.props.survey.getContainerContent(this.props.container);
        var needRenderWrapper = this.props.needRenderWrapper === false ? false : true;
        if (components.length == 0) {
            return null;
        }
        if (!needRenderWrapper) {
            return xn.createElement(xn.Fragment, null, components.map(function (component) {
                return ReactElementFactory.Instance.createElement(component.component, { survey: _this.props.survey, model: component.data, container: _this.props.container, key: component.id });
            }));
        }
        return xn.createElement("div", { className: "sv-components-column" + " sv-components-container-" + this.props.container }, components.map(function (component) {
            return ReactElementFactory.Instance.createElement(component.component, { survey: _this.props.survey, model: component.data, container: _this.props.container, key: component.id });
        }));
    };
    return ComponentsContainer;
}(xn.Component));

ReactElementFactory.Instance.registerElement("sv-components-container", function (props) {
    return xn.createElement(components_container_ComponentsContainer, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/svgbundle.tsx
var svgbundle_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var svgbundle_SvgBundleComponent = /** @class */ (function (_super) {
    svgbundle_extends(SvgBundleComponent, _super);
    function SvgBundleComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.containerRef = xn.createRef();
        return _this;
    }
    SvgBundleComponent.prototype.componentDidMount = function () {
        if (!!this.containerRef.current) {
            this.containerRef.current.innerHTML = external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SvgRegistry"].iconsRenderedHtml();
        }
    };
    SvgBundleComponent.prototype.render = function () {
        var svgStyle = {
            display: "none"
        };
        return xn.createElement("svg", { style: svgStyle, id: "sv-icon-holder-global-container", ref: this.containerRef });
    };
    return SvgBundleComponent;
}(xn.Component));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/popup/popup-modal.tsx
var popup_modal_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var popup_modal_PopupModal = /** @class */ (function (_super) {
    popup_modal_extends(PopupModal, _super);
    function PopupModal(props) {
        var _this = _super.call(this, props) || this;
        _this.isInitialized = false;
        _this.init = function () {
            if (!_this.isInitialized) {
                external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].showModal = function (componentName, data, onApply, onCancel, cssClass, title, displayMode) {
                    if (displayMode === void 0) { displayMode = "popup"; }
                    var options = Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["createDialogOptions"])(componentName, data, onApply, onCancel, undefined, undefined, cssClass, title, displayMode);
                    return _this.showDialog(options);
                };
                external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].showDialog = function (dialogOptions, rootElement) {
                    return _this.showDialog(dialogOptions, rootElement);
                };
                _this.isInitialized = true;
            }
        };
        _this.clean = function () {
            if (_this.isInitialized) {
                external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].showModal = undefined;
                external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].showDialog = undefined;
                _this.isInitialized = false;
            }
        };
        _this.state = { changed: 0 };
        _this.descriptor = {
            init: _this.init,
            clean: _this.clean
        };
        return _this;
    }
    PopupModal.addModalDescriptor = function (descriptor) {
        if (!external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].showModal) {
            descriptor.init();
        }
        this.modalDescriptors.push(descriptor);
    };
    PopupModal.removeModalDescriptor = function (descriptor) {
        descriptor.clean();
        this.modalDescriptors.splice(this.modalDescriptors.indexOf(descriptor), 1);
        if (!external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].showModal && this.modalDescriptors[0]) {
            this.modalDescriptors[0].init();
        }
    };
    PopupModal.prototype.renderElement = function () {
        if (!this.model)
            return null;
        return compat_module_P(xn.createElement(popup_PopupContainer, { model: this.model }), this.model.container);
    };
    PopupModal.prototype.showDialog = function (dialogOptions, rootElement) {
        var _this = this;
        this.model = Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["createPopupModalViewModel"])(dialogOptions, rootElement);
        var onVisibilityChangedCallback = function (_, options) {
            if (!options.isVisible) {
                _this.model.dispose();
                _this.model = undefined;
                _this.setState({ changed: _this.state.changed + 1 });
            }
        };
        this.model.onVisibilityChanged.add(onVisibilityChangedCallback);
        this.model.model.isVisible = true;
        this.setState({ changed: this.state.changed + 1 });
        return this.model;
    };
    PopupModal.prototype.componentDidMount = function () {
        PopupModal.addModalDescriptor(this.descriptor);
    };
    PopupModal.prototype.componentWillUnmount = function () {
        if (this.model) {
            this.model.dispose();
            this.model = undefined;
        }
        PopupModal.removeModalDescriptor(this.descriptor);
    };
    PopupModal.modalDescriptors = [];
    return PopupModal;
}(reactquestion_element_SurveyElementBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactSurvey.tsx
var reactSurvey_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};












var reactSurvey_Survey = /** @class */ (function (_super) {
    reactSurvey_extends(Survey, _super);
    function Survey(props) {
        var _this = _super.call(this, props) || this;
        _this.previousJSON = {};
        _this.isSurveyUpdated = false;
        _this.createSurvey(props);
        _this.updateSurvey(props, {});
        _this.rootRef = m();
        _this.rootNodeId = props.id || null;
        _this.rootNodeClassName = props.className || "";
        return _this;
    }
    Object.defineProperty(Survey, "cssType", {
        get: function () {
            return external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["surveyCss"].currentType;
        },
        set: function (value) {
            external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["StylesManager"].applyTheme(value);
        },
        enumerable: false,
        configurable: true
    });
    Survey.prototype.getStateElement = function () {
        return this.survey;
    };
    Survey.prototype.onSurveyUpdated = function () {
        if (!!this.survey) {
            var el = this.rootRef.current;
            if (!!el)
                this.survey.afterRenderSurvey(el);
            this.survey.startTimerFromUI();
            this.setSurveyEvents();
        }
    };
    Survey.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (!_super.prototype.shouldComponentUpdate.call(this, nextProps, nextState))
            return false;
        if (this.isModelJSONChanged(nextProps)) {
            this.destroySurvey();
            this.createSurvey(nextProps);
            this.updateSurvey(nextProps, {});
            this.isSurveyUpdated = true;
        }
        return true;
    };
    Survey.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.updateSurvey(this.props, prevProps);
        if (this.isSurveyUpdated) {
            this.onSurveyUpdated();
            this.isSurveyUpdated = false;
        }
    };
    Survey.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.onSurveyUpdated();
    };
    Survey.prototype.destroySurvey = function () {
        if (this.survey) {
            this.survey.renderCallback = undefined;
            this.survey.onPartialSend.clear();
            this.survey.stopTimer();
            this.survey.destroyResizeObserver();
        }
    };
    Survey.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.destroySurvey();
    };
    Survey.prototype.doRender = function () {
        var renderResult;
        if (this.survey.state == "completed") {
            renderResult = this.renderCompleted();
        }
        else if (this.survey.state == "completedbefore") {
            renderResult = this.renderCompletedBefore();
        }
        else if (this.survey.state == "loading") {
            renderResult = this.renderLoading();
        }
        else if (this.survey.state == "empty") {
            renderResult = this.renderEmptySurvey();
        }
        else {
            renderResult = this.renderSurvey();
        }
        var backgroundImage = !!this.survey.backgroundImage ? _("div", { className: this.css.rootBackgroundImage, style: this.survey.backgroundImageStyle }) : null;
        var header = this.survey.headerView === "basic" ? _(survey_header_SurveyHeader, { survey: this.survey }) : null;
        var onSubmit = function (event) {
            event.preventDefault();
        };
        var customHeader = _("div", { className: "sv_custom_header" });
        if (this.survey.hasLogo) {
            customHeader = null;
        }
        var rootCss = this.survey.getRootCss();
        var cssClasses = this.rootNodeClassName ? this.rootNodeClassName + " " + rootCss : rootCss;
        return (_("div", { id: this.rootNodeId, ref: this.rootRef, className: cssClasses, style: this.survey.themeVariables, lang: this.survey.locale || "en", dir: this.survey.localeDir },
            this.survey.needRenderIcons ? _(svgbundle_SvgBundleComponent, null) : null,
            _(popup_modal_PopupModal, null),
            _("div", { className: this.survey.wrapperFormCss },
                backgroundImage,
                _("form", { onSubmit: onSubmit },
                    customHeader,
                    _("div", { className: this.css.container },
                        header,
                        _(components_container_ComponentsContainer, { survey: this.survey, container: "header", needRenderWrapper: false }),
                        renderResult,
                        _(components_container_ComponentsContainer, { survey: this.survey, container: "footer", needRenderWrapper: false }))),
                _(notifier_NotifierComponent, { notifier: this.survey.notifier }))));
    };
    Survey.prototype.renderElement = function () {
        return this.doRender();
    };
    Object.defineProperty(Survey.prototype, "css", {
        get: function () {
            return this.survey.css;
        },
        set: function (value) {
            this.survey.css = value;
        },
        enumerable: false,
        configurable: true
    });
    Survey.prototype.renderCompleted = function () {
        if (!this.survey.showCompletedPage)
            return null;
        var htmlValue = { __html: this.survey.processedCompletedHtml };
        return (_(b, null,
            _("div", { dangerouslySetInnerHTML: htmlValue, className: this.survey.completedCss }),
            _(components_container_ComponentsContainer, { survey: this.survey, container: "completePage", needRenderWrapper: false })));
    };
    Survey.prototype.renderCompletedBefore = function () {
        var htmlValue = { __html: this.survey.processedCompletedBeforeHtml };
        return (_("div", { dangerouslySetInnerHTML: htmlValue, className: this.survey.completedBeforeCss }));
    };
    Survey.prototype.renderLoading = function () {
        var htmlValue = { __html: this.survey.processedLoadingHtml };
        return (_("div", { dangerouslySetInnerHTML: htmlValue, className: this.survey.loadingBodyCss }));
    };
    Survey.prototype.renderSurvey = function () {
        var activePage = this.survey.activePage
            ? this.renderPage(this.survey.activePage)
            : null;
        var isStaring = this.survey.isShowStartingPage;
        var pageId = this.survey.activePage ? this.survey.activePage.id : "";
        var className = this.survey.bodyCss;
        var style = {};
        if (!!this.survey.renderedWidth) {
            style.maxWidth = this.survey.renderedWidth;
        }
        return (_("div", { className: this.survey.bodyContainerCss },
            _(components_container_ComponentsContainer, { survey: this.survey, container: "left" }),
            _("div", { className: "sv-components-column sv-components-column--expandable" },
                _(components_container_ComponentsContainer, { survey: this.survey, container: "center" }),
                _("div", { id: pageId, className: className, style: style },
                    _(components_container_ComponentsContainer, { survey: this.survey, container: "contentTop" }),
                    activePage,
                    _(components_container_ComponentsContainer, { survey: this.survey, container: "contentBottom" }),
                    this.survey.showBrandInfo ? _(brand_info_BrandInfo, null) : null)),
            _(components_container_ComponentsContainer, { survey: this.survey, container: "right" })));
    };
    Survey.prototype.renderPage = function (page) {
        return (_(page_SurveyPage, { survey: this.survey, page: page, css: this.css, creator: this }));
    };
    Survey.prototype.renderEmptySurvey = function () {
        return _("div", { className: this.css.bodyEmpty }, this.survey.emptySurveyText);
    };
    Survey.prototype.createSurvey = function (newProps) {
        if (!newProps)
            newProps = {};
        this.previousJSON = {};
        if (newProps) {
            if (newProps.model) {
                this.survey = newProps.model;
            }
            else {
                if (newProps.json) {
                    this.previousJSON = newProps.json;
                    this.survey = new external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyModel"](newProps.json);
                }
            }
        }
        else {
            this.survey = new external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyModel"]();
        }
        if (!!newProps.css) {
            this.survey.css = this.css;
        }
    };
    Survey.prototype.isModelJSONChanged = function (newProps) {
        if (!!newProps["model"]) {
            return this.survey !== newProps["model"];
        }
        if (!!newProps["json"]) {
            return !external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["Helpers"].isTwoValueEquals(newProps["json"], this.previousJSON);
        }
        return false;
    };
    Survey.prototype.updateSurvey = function (newProps, oldProps) {
        if (!newProps)
            return;
        oldProps = oldProps || {};
        for (var key in newProps) {
            if (key == "model" || key == "children" || key == "json") {
                continue;
            }
            if (key == "css") {
                this.survey.mergeValues(newProps.css, this.survey.getCss());
                this.survey["updateNavigationCss"]();
                this.survey["updateElementCss"]();
                continue;
            }
            if (newProps[key] === oldProps[key])
                continue;
            if (key.indexOf("on") == 0 && this.survey[key] && this.survey[key].add) {
                if (!!oldProps[key]) {
                    this.survey[key].remove(oldProps[key]);
                }
                this.survey[key].add(newProps[key]);
            }
            else {
                this.survey[key] = newProps[key];
            }
        }
    };
    Survey.prototype.setSurveyEvents = function () {
        var self = this;
        this.survey.renderCallback = function () {
            var counter = !!self.state && !!self.state.modelChanged ? self.state.modelChanged : 0;
            self.setState({ modelChanged: counter + 1 });
        };
        this.survey.onPartialSend.add(function (sender) {
            if (!!self.state) {
                self.setState(self.state);
            }
        });
    };
    //ISurveyCreator
    Survey.prototype.createQuestionElement = function (question) {
        return ReactQuestionFactory.Instance.createQuestion(question.isDefaultRendering() ? question.getTemplate() : question.getComponentName(), {
            question: question,
            isDisplayMode: question.isInputReadOnly,
            creator: this,
        });
    };
    Survey.prototype.renderError = function (key, error, cssClasses, element) {
        return ReactElementFactory.Instance.createElement(this.survey.questionErrorComponent, { key: key, error: error, cssClasses: cssClasses, element: element });
    };
    Survey.prototype.questionTitleLocation = function () {
        return this.survey.questionTitleLocation;
    };
    Survey.prototype.questionErrorLocation = function () {
        return this.survey.questionErrorLocation;
    };
    return Survey;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("survey", function (props) {
    return _(reactSurvey_Survey, props);
});
function attachKey2click(element, viewModel, options) {
    if (options === void 0) { options = { processEsc: true, disableTabStop: false }; }
    if ((!!viewModel && viewModel.disableTabStop) || (!!options && options.disableTabStop)) {
        return sn(element, { tabIndex: -1 });
    }
    options = __assign({}, options);
    return sn(element, {
        tabIndex: 0,
        onKeyUp: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["doKey2ClickUp"])(evt, options);
            return false;
        },
        onKeyDown: function (evt) { return Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["doKey2ClickDown"])(evt, options); },
        onBlur: function (evt) { return Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["doKey2ClickBlur"])(evt); },
    });
}

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactSurveyNavigationBase.tsx
var reactSurveyNavigationBase_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var SurveyNavigationBase = /** @class */ (function (_super) {
    reactSurveyNavigationBase_extends(SurveyNavigationBase, _super);
    function SurveyNavigationBase(props) {
        var _this = _super.call(this, props) || this;
        _this.updateStateFunction = null;
        _this.state = { update: 0 };
        return _this;
    }
    Object.defineProperty(SurveyNavigationBase.prototype, "survey", {
        get: function () {
            return this.props.survey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyNavigationBase.prototype, "css", {
        get: function () {
            return this.props.css || this.survey.css;
        },
        enumerable: false,
        configurable: true
    });
    SurveyNavigationBase.prototype.componentDidMount = function () {
        if (this.survey) {
            var self = this;
            this.updateStateFunction = function () {
                self.setState({ update: self.state.update + 1 });
            };
            this.survey.onPageVisibleChanged.add(this.updateStateFunction);
        }
    };
    SurveyNavigationBase.prototype.componentWillUnmount = function () {
        if (this.survey && this.updateStateFunction) {
            this.survey.onPageVisibleChanged.remove(this.updateStateFunction);
            this.updateStateFunction = null;
        }
    };
    return SurveyNavigationBase;
}(k));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/reacttimerpanel.tsx
var reacttimerpanel_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var reacttimerpanel_SurveyTimerPanel = /** @class */ (function (_super) {
    reacttimerpanel_extends(SurveyTimerPanel, _super);
    function SurveyTimerPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.circleLength = 440;
        return _this;
    }
    SurveyTimerPanel.prototype.getStateElement = function () {
        return this.timerModel;
    };
    Object.defineProperty(SurveyTimerPanel.prototype, "timerModel", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyTimerPanel.prototype, "progress", {
        get: function () {
            return -this.timerModel.progress * this.circleLength;
        },
        enumerable: false,
        configurable: true
    });
    SurveyTimerPanel.prototype.render = function () {
        if (!this.timerModel.isRunning) {
            return null;
        }
        var result = _("div", { className: this.timerModel.survey.getCss().timerRoot }, this.timerModel.text);
        if (this.timerModel.showTimerAsClock) {
            var style = { strokeDasharray: this.circleLength, strokeDashoffset: this.progress };
            var progress = (this.timerModel.showProgress ? _(svg_icon_SvgIcon, { className: this.timerModel.getProgressCss(), style: style, iconName: "icon-timercircle", size: "auto" }) : null);
            result =
                (_("div", { className: this.timerModel.rootCss },
                    progress,
                    _("div", { className: this.timerModel.textContainerCss },
                        _("span", { className: this.timerModel.majorTextCss }, this.timerModel.clockMajorText),
                        (this.timerModel.clockMinorText ? _("span", { className: this.timerModel.minorTextCss }, this.timerModel.clockMinorText) : null))));
        }
        return result;
    };
    return SurveyTimerPanel;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("sv-timerpanel", function (props) {
    return _(reacttimerpanel_SurveyTimerPanel, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/panel.tsx
var panel_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();









var panel_SurveyPanel = /** @class */ (function (_super) {
    panel_extends(SurveyPanel, _super);
    function SurveyPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.hasBeenExpanded = false;
        return _this;
    }
    Object.defineProperty(SurveyPanel.prototype, "panel", {
        get: function () {
            return this.panelBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyPanel.prototype.renderElement = function () {
        var _this = this;
        var header = this.renderHeader();
        var errors = (_(reactquestion_SurveyElementErrors, { element: this.panelBase, cssClasses: this.panelBase.cssClasses, creator: this.creator }));
        var style = {
            paddingLeft: this.panel.innerPaddingLeft,
            display: this.panel.renderedIsExpanded ? undefined : "none",
        };
        var content = null;
        if (this.panel.renderedIsExpanded) {
            // this.hasBeenExpanded = true;
            var rows = this.renderRows(this.panelBase.cssClasses);
            var className = this.panelBase.cssClasses.panel.content;
            content = this.renderContent(style, rows, className);
        }
        var focusIn = function () {
            if (_this.panelBase)
                _this.panelBase.focusIn();
        };
        return (_("div", { ref: this.rootRef, className: this.panelBase.getContainerCss(), onFocus: focusIn, id: this.panelBase.id },
            this.panel.showErrorsAbovePanel ? errors : null,
            header,
            this.panel.showErrorsAbovePanel ? null : errors,
            content));
    };
    SurveyPanel.prototype.renderHeader = function () {
        if (!this.panel.hasTitle && !this.panel.hasDescription) {
            return null;
        }
        return _(element_header_SurveyElementHeader, { element: this.panel });
    };
    SurveyPanel.prototype.wrapElement = function (element) {
        var survey = this.panel.survey;
        var wrapper = null;
        if (survey) {
            wrapper = reactsurveymodel_ReactSurveyElementsWrapper.wrapElement(survey, element, this.panel);
        }
        return wrapper !== null && wrapper !== void 0 ? wrapper : element;
    };
    SurveyPanel.prototype.renderContent = function (style, rows, className) {
        var bottom = this.renderBottom();
        return (_("div", { style: style, className: className, id: this.panel.contentId },
            rows,
            bottom));
    };
    SurveyPanel.prototype.renderTitle = function () {
        if (!this.panelBase.title)
            return null;
        return _(title_element_TitleElement, { element: this.panelBase });
    };
    SurveyPanel.prototype.renderDescription = function () {
        if (!this.panelBase.description)
            return null;
        var text = reactquestion_element_SurveyElementBase.renderLocString(this.panelBase.locDescription);
        return (_("div", { className: this.panel.cssClasses.panel.description }, text));
    };
    SurveyPanel.prototype.renderBottom = function () {
        var footerToolbar = this.panel.getFooterToolbar();
        if (!footerToolbar.hasActions)
            return null;
        return _(action_bar_SurveyActionBar, { model: footerToolbar });
    };
    SurveyPanel.prototype.getIsVisible = function () {
        return this.panelBase.getIsContentVisible();
    };
    return SurveyPanel;
}(panel_base_SurveyPanelBase));

ReactElementFactory.Instance.registerElement("panel", function (props) {
    return _(panel_SurveyPanel, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/flow-panel.tsx
var flow_panel_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var flow_panel_SurveyFlowPanel = /** @class */ (function (_super) {
    flow_panel_extends(SurveyFlowPanel, _super);
    function SurveyFlowPanel(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyFlowPanel.prototype, "flowPanel", {
        get: function () {
            return this.panel;
        },
        enumerable: false,
        configurable: true
    });
    SurveyFlowPanel.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (!!this.flowPanel) {
            this.flowPanel.onCustomHtmlProducing = function () {
                return "";
            };
            this.flowPanel.onGetHtmlForQuestion = this.renderQuestion;
        }
    };
    SurveyFlowPanel.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (!!this.flowPanel) {
            this.flowPanel.onCustomHtmlProducing = null;
            this.flowPanel.onGetHtmlForQuestion = null;
        }
    };
    SurveyFlowPanel.prototype.getQuestion = function (name) {
        return this.flowPanel.getQuestionByName(name);
    };
    SurveyFlowPanel.prototype.renderQuestion = function (question) {
        return "<question>" + question.name + "</question>";
    };
    SurveyFlowPanel.prototype.renderRows = function () {
        var result = this.renderHtml();
        if (!!result) {
            return [result];
        }
        else {
            return [];
        }
    };
    SurveyFlowPanel.prototype.getNodeIndex = function () {
        return this.renderedIndex++;
    };
    SurveyFlowPanel.prototype.renderHtml = function () {
        if (!this.flowPanel)
            return null;
        var html = "<span>" + this.flowPanel.produceHtml() + "</span>";
        if (!DOMParser) {
            var htmlValue = { __html: html };
            return _("div", { dangerouslySetInnerHTML: htmlValue });
        }
        var doc = new DOMParser().parseFromString(html, "text/xml");
        this.renderedIndex = 0;
        return this.renderParentNode(doc);
    };
    SurveyFlowPanel.prototype.renderNodes = function (domNodes) {
        var nodes = [];
        for (var i = 0; i < domNodes.length; i++) {
            var node = this.renderNode(domNodes[i]);
            if (!!node) {
                nodes.push(node);
            }
        }
        return nodes;
    };
    SurveyFlowPanel.prototype.getStyle = function (nodeType) {
        var style = {};
        if (nodeType.toLowerCase() === "b") {
            style.fontWeight = "bold";
        }
        if (nodeType.toLowerCase() === "i") {
            style.fontStyle = "italic";
        }
        if (nodeType.toLowerCase() === "u") {
            style.textDecoration = "underline";
        }
        return style;
    };
    SurveyFlowPanel.prototype.renderParentNode = function (node) {
        var nodeType = node.nodeName.toLowerCase();
        var children = this.renderNodes(this.getChildDomNodes(node));
        if (nodeType === "div")
            return _("div", { key: this.getNodeIndex() }, children);
        return (_("span", { key: this.getNodeIndex(), style: this.getStyle(nodeType) }, children));
    };
    SurveyFlowPanel.prototype.renderNode = function (node) {
        if (!this.hasTextChildNodesOnly(node)) {
            return this.renderParentNode(node);
        }
        var nodeType = node.nodeName.toLowerCase();
        if (nodeType === "question") {
            var question = this.flowPanel.getQuestionByName(node.textContent);
            if (!question)
                return null;
            var questionBody = (_(reactquestion_SurveyQuestion, { key: question.name, element: question, creator: this.creator, css: this.css }));
            return _("span", { key: this.getNodeIndex() }, questionBody);
        }
        if (nodeType === "div") {
            return _("div", { key: this.getNodeIndex() }, node.textContent);
        }
        return (_("span", { key: this.getNodeIndex(), style: this.getStyle(nodeType) }, node.textContent));
    };
    SurveyFlowPanel.prototype.getChildDomNodes = function (node) {
        var domNodes = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            domNodes.push(node.childNodes[i]);
        }
        return domNodes;
    };
    SurveyFlowPanel.prototype.hasTextChildNodesOnly = function (node) {
        var nodes = node.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName.toLowerCase() !== "#text")
                return false;
        }
        return true;
    };
    SurveyFlowPanel.prototype.renderContent = function (style, rows) {
        return _("f-panel", { style: style }, rows);
    };
    return SurveyFlowPanel;
}(panel_SurveyPanel));

ReactElementFactory.Instance.registerElement("flowpanel", function (props) {
    return _(flow_panel_SurveyFlowPanel, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_checkbox.tsx
var reactquestion_checkbox_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var reactquestion_checkbox_SurveyQuestionCheckbox = /** @class */ (function (_super) {
    reactquestion_checkbox_extends(SurveyQuestionCheckbox, _super);
    function SurveyQuestionCheckbox(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionCheckbox.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionCheckbox.prototype.renderElement = function () {
        var _this = this;
        var cssClasses = this.question.cssClasses;
        return (_("fieldset", { className: this.question.getSelectBaseRootCss(), ref: function (fieldset) { return (_this.setControl(fieldset)); }, role: this.question.a11y_input_ariaRole, "aria-required": this.question.a11y_input_ariaRequired, "aria-label": this.question.a11y_input_ariaLabel, "aria-labelledby": this.question.a11y_input_ariaLabelledBy, "aria-describedby": this.question.a11y_input_ariaDescribedBy, "aria-invalid": this.question.a11y_input_ariaInvalid, "aria-errormessage": this.question.a11y_input_ariaErrormessage },
            _("legend", { className: "sv-hidden" }, this.question.locTitle.renderedHtml),
            this.getHeader(),
            this.question.hasColumns
                ? this.getColumnedBody(cssClasses)
                : this.getBody(cssClasses),
            this.getFooter(),
            this.question.isOtherSelected ? this.renderOther() : null));
    };
    SurveyQuestionCheckbox.prototype.getHeader = function () {
        var _this = this;
        if (this.question.hasHeadItems) {
            return this.question.headItems.map(function (item, ii) {
                return _this.renderItem(item, false, _this.question.cssClasses);
            });
        }
    };
    SurveyQuestionCheckbox.prototype.getFooter = function () {
        var _this = this;
        if (this.question.hasFootItems) {
            return this.question.footItems.map(function (item, ii) {
                return _this.renderItem(item, false, _this.question.cssClasses);
            });
        }
    };
    SurveyQuestionCheckbox.prototype.getColumnedBody = function (cssClasses) {
        return (_("div", { className: cssClasses.rootMultiColumn }, this.getColumns(cssClasses)));
    };
    SurveyQuestionCheckbox.prototype.getColumns = function (cssClasses) {
        var _this = this;
        return this.question.columns.map(function (column, ci) {
            var items = column.map(function (item, ii) {
                return _this.renderItem(item, ci === 0 && ii === 0, cssClasses, "" + ci + ii);
            });
            return (_("div", { key: "column" + ci + _this.question.getItemsColumnKey(column), className: _this.question.getColumnClass(), role: "presentation" }, items));
        });
    };
    SurveyQuestionCheckbox.prototype.getBody = function (cssClasses) {
        if (this.question.blockedRow) {
            return _("div", { className: cssClasses.rootRow }, this.getItems(cssClasses, this.question.dataChoices));
        }
        else
            return _(b, null, this.getItems(cssClasses, this.question.bodyItems));
    };
    SurveyQuestionCheckbox.prototype.getItems = function (cssClasses, choices) {
        var renderedItems = [];
        for (var i = 0; i < choices.length; i++) {
            var item = choices[i];
            var key = "item" + item.value;
            var renderedItem = this.renderItem(item, i == 0, cssClasses, "" + i);
            if (!!renderedItem) {
                renderedItems.push(renderedItem);
            }
        }
        return renderedItems;
    };
    Object.defineProperty(SurveyQuestionCheckbox.prototype, "textStyle", {
        get: function () {
            return null;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionCheckbox.prototype.renderOther = function () {
        var cssClasses = this.question.cssClasses;
        return (_("div", { className: this.question.getCommentAreaCss(true) },
            _(SurveyQuestionOtherValueItem, { question: this.question, otherCss: cssClasses.other, cssClasses: cssClasses, isDisplayMode: this.isDisplayMode })));
    };
    SurveyQuestionCheckbox.prototype.renderItem = function (item, isFirst, cssClasses, index) {
        var renderedItem = ReactElementFactory.Instance.createElement(this.question.itemComponent, {
            key: item.value,
            question: this.question,
            cssClasses: cssClasses,
            isDisplayMode: this.isDisplayMode,
            item: item,
            textStyle: this.textStyle,
            index: index,
            isFirst: isFirst,
        });
        var survey = this.question.survey;
        var wrappedItem = null;
        if (!!survey && !!renderedItem) {
            wrappedItem = reactsurveymodel_ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
        }
        return wrappedItem !== null && wrappedItem !== void 0 ? wrappedItem : renderedItem;
    };
    return SurveyQuestionCheckbox;
}(reactquestion_element_SurveyQuestionElementBase));

var reactquestion_checkbox_SurveyQuestionCheckboxItem = /** @class */ (function (_super) {
    reactquestion_checkbox_extends(SurveyQuestionCheckboxItem, _super);
    function SurveyQuestionCheckboxItem(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnChange = function (event) {
            _this.question.clickItemHandler(_this.item, event.target.checked);
        };
        _this.rootRef = m();
        return _this;
    }
    SurveyQuestionCheckboxItem.prototype.getStateElement = function () {
        return this.item;
    };
    Object.defineProperty(SurveyQuestionCheckboxItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionCheckboxItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionCheckboxItem.prototype, "textStyle", {
        get: function () {
            return this.props.textStyle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionCheckboxItem.prototype, "isFirst", {
        get: function () {
            return this.props.isFirst;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionCheckboxItem.prototype, "index", {
        get: function () {
            return this.props.index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionCheckboxItem.prototype, "hideCaption", {
        get: function () {
            return this.props.hideCaption === true;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionCheckboxItem.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (prevProps.item !== this.props.item && !this.question.isDesignMode) {
            if (this.props.item) {
                this.props.item.setRootElement(this.rootRef.current);
            }
            if (prevProps.item) {
                prevProps.item.setRootElement(undefined);
            }
        }
    };
    SurveyQuestionCheckboxItem.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (!_super.prototype.shouldComponentUpdate.call(this, nextProps, nextState))
            return false;
        return (!this.question.customWidget ||
            !!this.question.customWidgetData.isNeedRender ||
            !!this.question.customWidget.widgetJson.isDefaultRender ||
            !!this.question.customWidget.widgetJson.render);
    };
    SurveyQuestionCheckboxItem.prototype.canRender = function () {
        return !!this.item && !!this.question;
    };
    SurveyQuestionCheckboxItem.prototype.renderElement = function () {
        var isChecked = this.question.isItemSelected(this.item);
        return this.renderCheckbox(isChecked, null);
    };
    Object.defineProperty(SurveyQuestionCheckboxItem.prototype, "inputStyle", {
        get: function () {
            return null; //{ marginRight: "3px" };
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionCheckboxItem.prototype.renderCheckbox = function (isChecked, otherItem) {
        var id = this.question.getItemId(this.item);
        var itemClass = this.question.getItemClass(this.item);
        var labelClass = this.question.getLabelClass(this.item);
        var itemLabel = !this.hideCaption ? _("span", { className: this.cssClasses.controlLabel }, this.renderLocString(this.item.locText, this.textStyle)) : null;
        return (_("div", { className: itemClass, role: "presentation", ref: this.rootRef },
            _("label", { className: labelClass },
                _("input", { className: this.cssClasses.itemControl, type: "checkbox", name: this.question.name + this.item.id, value: this.item.value, id: id, style: this.inputStyle, disabled: !this.question.getItemEnabled(this.item), readOnly: this.question.isReadOnlyAttr, checked: isChecked, onChange: this.handleOnChange, required: this.question.hasRequiredError() }),
                this.cssClasses.materialDecorator ?
                    _("span", { className: this.cssClasses.materialDecorator }, this.question.itemSvgIcon ?
                        _("svg", { className: this.cssClasses.itemDecorator },
                            _("use", { xlinkHref: this.question.itemSvgIcon })) :
                        null) :
                    null,
                itemLabel),
            otherItem));
    };
    SurveyQuestionCheckboxItem.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (!this.question.isDesignMode) {
            this.item.setRootElement(this.rootRef.current);
        }
    };
    SurveyQuestionCheckboxItem.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (!this.question.isDesignMode) {
            this.item.setRootElement(undefined);
        }
    };
    return SurveyQuestionCheckboxItem;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("survey-checkbox-item", function (props) {
    return _(reactquestion_checkbox_SurveyQuestionCheckboxItem, props);
});
ReactQuestionFactory.Instance.registerQuestion("checkbox", function (props) {
    return _(reactquestion_checkbox_SurveyQuestionCheckbox, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_ranking.tsx
var reactquestion_ranking_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var reactquestion_ranking_SurveyQuestionRanking = /** @class */ (function (_super) {
    reactquestion_ranking_extends(SurveyQuestionRanking, _super);
    function SurveyQuestionRanking() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyQuestionRanking.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionRanking.prototype.renderElement = function () {
        var _this = this;
        if (!this.question.selectToRankEnabled) {
            return (_("div", { className: this.question.rootClass, ref: function (root) { return (_this.setControl(root)); } }, this.getItems()));
        }
        else {
            var unrankedItem = true;
            return (_("div", { className: this.question.rootClass, ref: function (root) { return (_this.setControl(root)); } },
                _("div", { className: this.question.getContainerClasses("from"), "data-ranking": "from-container" },
                    this.getItems(this.question.renderedUnRankingChoices, unrankedItem),
                    this.question.renderedUnRankingChoices.length === 0 ? _("div", { className: this.question.cssClasses.containerPlaceholder },
                        " ",
                        this.renderLocString(this.question.locSelectToRankEmptyRankedAreaText),
                        " ") : null),
                _("div", { className: this.question.cssClasses.containersDivider }),
                _("div", { className: this.question.getContainerClasses("to"), "data-ranking": "to-container" },
                    this.getItems(),
                    this.question.renderedRankingChoices.length === 0 ? _("div", { className: this.question.cssClasses.containerPlaceholder },
                        " ",
                        this.renderLocString(this.question.locSelectToRankEmptyUnrankedAreaText),
                        " ") : null)));
        }
    };
    SurveyQuestionRanking.prototype.getItems = function (choices, unrankedItem) {
        var _this = this;
        if (choices === void 0) { choices = this.question.renderedRankingChoices; }
        var items = [];
        var _loop_1 = function (i) {
            var item = choices[i];
            items.push(this_1.renderItem(item, i, function (event) {
                _this.question.handleKeydown.call(_this.question, event, item);
            }, function (event) {
                event.persist();
                //event.preventDefault();
                _this.question.handlePointerDown.call(_this.question, event, item, event.currentTarget);
            }, function (event) {
                event.persist();
                //event.preventDefault();
                _this.question.handlePointerUp.call(_this.question, event, item, event.currentTarget);
            }, this_1.question.cssClasses, this_1.question.getItemClass(item), this_1.question, unrankedItem));
        };
        var this_1 = this;
        for (var i = 0; i < choices.length; i++) {
            _loop_1(i);
        }
        return items;
    };
    SurveyQuestionRanking.prototype.renderItem = function (item, i, handleKeydown, handlePointerDown, handlePointerUp, cssClasses, itemClass, question, unrankedItem) {
        var key = "id-" + item.renderedId;
        var text = this.renderLocString(item.locText);
        var index = i;
        var indexText = this.question.getNumberByIndex(index);
        var tabIndex = this.question.getItemTabIndex(item);
        var renderedItem = (_(reactquestion_ranking_SurveyQuestionRankingItem, { key: item.value, text: text, index: index, indexText: indexText, itemTabIndex: tabIndex, handleKeydown: handleKeydown, handlePointerDown: handlePointerDown, handlePointerUp: handlePointerUp, cssClasses: cssClasses, itemClass: itemClass, question: question, unrankedItem: unrankedItem, item: item }));
        var survey = this.question.survey;
        var wrappedItem = null;
        if (!!survey) {
            wrappedItem = reactsurveymodel_ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
        }
        return wrappedItem !== null && wrappedItem !== void 0 ? wrappedItem : renderedItem;
    };
    return SurveyQuestionRanking;
}(reactquestion_element_SurveyQuestionElementBase));

var reactquestion_ranking_SurveyQuestionRankingItem = /** @class */ (function (_super) {
    reactquestion_ranking_extends(SurveyQuestionRankingItem, _super);
    function SurveyQuestionRankingItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "text", {
        get: function () {
            return this.props.text;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "index", {
        get: function () {
            return this.props.index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "indexText", {
        get: function () {
            return this.props.indexText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "handleKeydown", {
        get: function () {
            return this.props.handleKeydown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "handlePointerDown", {
        get: function () {
            return this.props.handlePointerDown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "handlePointerUp", {
        get: function () {
            return this.props.handlePointerUp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "cssClasses", {
        get: function () {
            return this.props.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "itemClass", {
        get: function () {
            return this.props.itemClass;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "itemTabIndex", {
        get: function () {
            return this.props.itemTabIndex;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "unrankedItem", {
        get: function () {
            return this.props.unrankedItem;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionRankingItem.prototype.renderEmptyIcon = function () {
        return (_("svg", null,
            _("use", { xlinkHref: this.question.dashSvgIcon })));
    };
    SurveyQuestionRankingItem.prototype.renderElement = function () {
        var itemContent = ReactElementFactory.Instance.createElement(this.question.itemComponent, { item: this.item, cssClasses: this.cssClasses });
        return (_("div", { tabIndex: this.itemTabIndex, className: this.itemClass, onKeyDown: this.handleKeydown, onPointerDown: this.handlePointerDown, onPointerUp: this.handlePointerUp, "data-sv-drop-target-ranking-item": this.index },
            _("div", { tabIndex: -1, style: { outline: "none" } },
                _("div", { className: this.cssClasses.itemGhostNode }),
                _("div", { className: this.cssClasses.itemContent },
                    _("div", { className: this.cssClasses.itemIconContainer },
                        _("svg", { className: this.question.getIconHoverCss() },
                            _("use", { xlinkHref: this.question.dragDropSvgIcon })),
                        _("svg", { className: this.question.getIconFocusCss() },
                            _("use", { xlinkHref: this.question.arrowsSvgIcon }))),
                    _("div", { className: this.question.getItemIndexClasses(this.item) }, (!this.unrankedItem && this.indexText) ? this.indexText : this.renderEmptyIcon()),
                    itemContent))));
    };
    return SurveyQuestionRankingItem;
}(ReactSurveyElement));

var reactquestion_ranking_SurveyQuestionRankingItemContent = /** @class */ (function (_super) {
    reactquestion_ranking_extends(SurveyQuestionRankingItemContent, _super);
    function SurveyQuestionRankingItemContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyQuestionRankingItemContent.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRankingItemContent.prototype, "cssClasses", {
        get: function () {
            return this.props.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionRankingItemContent.prototype.renderElement = function () {
        return _("div", { className: this.cssClasses.controlLabel }, reactquestion_element_SurveyElementBase.renderLocString(this.item.locText));
    };
    return SurveyQuestionRankingItemContent;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("sv-ranking-item", function (props) {
    return _(reactquestion_ranking_SurveyQuestionRankingItemContent, props);
});
ReactQuestionFactory.Instance.registerQuestion("ranking", function (props) {
    return _(reactquestion_ranking_SurveyQuestionRanking, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/rating/rating-item.tsx
var rating_item_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var RatingItemBase = /** @class */ (function (_super) {
    rating_item_extends(RatingItemBase, _super);
    function RatingItemBase(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnMouseDown = _this.handleOnMouseDown.bind(_this);
        return _this;
    }
    Object.defineProperty(RatingItemBase.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RatingItemBase.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RatingItemBase.prototype, "index", {
        get: function () {
            return this.props.index;
        },
        enumerable: false,
        configurable: true
    });
    RatingItemBase.prototype.getStateElement = function () {
        return this.item;
    };
    RatingItemBase.prototype.handleOnMouseDown = function (event) {
        this.question.onMouseDown();
    };
    return RatingItemBase;
}(reactquestion_element_SurveyElementBase));

var rating_item_RatingItem = /** @class */ (function (_super) {
    rating_item_extends(RatingItem, _super);
    function RatingItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RatingItem.prototype.render = function () {
        var itemText = this.renderLocString(this.item.locText);
        return (xn.createElement("label", { onMouseDown: this.handleOnMouseDown, className: this.question.getItemClassByText(this.item.itemValue, this.item.text) },
            xn.createElement("input", { type: "radio", className: "sv-visuallyhidden", name: this.question.questionName, id: this.question.getInputId(this.index), value: this.item.value, disabled: this.question.isDisabledAttr, readOnly: this.question.isReadOnlyAttr, checked: this.question.value == this.item.value, onClick: this.props.handleOnClick, onChange: function () { }, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage }),
            xn.createElement("span", { className: this.question.cssClasses.itemText, "data-text": this.item.text }, itemText)));
    };
    RatingItem.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
    };
    return RatingItem;
}(RatingItemBase));

ReactElementFactory.Instance.registerElement("sv-rating-item", function (props) {
    return xn.createElement(rating_item_RatingItem, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/rating/rating-item-star.tsx
var rating_item_star_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var rating_item_star_RatingItemStar = /** @class */ (function (_super) {
    rating_item_star_extends(RatingItemStar, _super);
    function RatingItemStar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RatingItemStar.prototype.render = function () {
        var _this = this;
        return (xn.createElement("label", { onMouseDown: this.handleOnMouseDown, className: this.question.getItemClass(this.item.itemValue), onMouseOver: function (e) { return _this.question.onItemMouseIn(_this.item); }, onMouseOut: function (e) { return _this.question.onItemMouseOut(_this.item); } },
            xn.createElement("input", { type: "radio", className: "sv-visuallyhidden", name: this.question.questionName, id: this.question.getInputId(this.index), value: this.item.value, disabled: this.question.isDisabledAttr, readOnly: this.question.isReadOnlyAttr, checked: this.question.value == this.item.value, onClick: this.props.handleOnClick, onChange: function () { }, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage }),
            xn.createElement(svg_icon_SvgIcon, { className: "sv-star", size: "auto", iconName: this.question.itemStarIcon, title: this.item.text }),
            xn.createElement(svg_icon_SvgIcon, { className: "sv-star-2", size: "auto", iconName: this.question.itemStarIconAlt, title: this.item.text })));
    };
    return RatingItemStar;
}(RatingItemBase));

ReactElementFactory.Instance.registerElement("sv-rating-item-star", function (props) {
    return xn.createElement(rating_item_star_RatingItemStar, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/rating/rating-item-smiley.tsx
var rating_item_smiley_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var rating_item_smiley_RatingItemSmiley = /** @class */ (function (_super) {
    rating_item_smiley_extends(RatingItemSmiley, _super);
    function RatingItemSmiley() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RatingItemSmiley.prototype.render = function () {
        var _this = this;
        return (xn.createElement("label", { onMouseDown: this.handleOnMouseDown, style: this.question.getItemStyle(this.item.itemValue, this.item.highlight), className: this.question.getItemClass(this.item.itemValue), onMouseOver: function (e) { return _this.question.onItemMouseIn(_this.item); }, onMouseOut: function (e) { return _this.question.onItemMouseOut(_this.item); } },
            xn.createElement("input", { type: "radio", className: "sv-visuallyhidden", name: this.question.questionName, id: this.question.getInputId(this.index), value: this.item.value, disabled: this.question.isDisabledAttr, readOnly: this.question.isReadOnlyAttr, checked: this.question.value == this.item.value, onClick: this.props.handleOnClick, onChange: function () { }, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage }),
            xn.createElement(svg_icon_SvgIcon, { size: "auto", iconName: this.question.getItemSmileyIconName(this.item.itemValue), title: this.item.text })));
    };
    return RatingItemSmiley;
}(RatingItemBase));

ReactElementFactory.Instance.registerElement("sv-rating-item-smiley", function (props) {
    return xn.createElement(rating_item_smiley_RatingItemSmiley, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/rating/rating-dropdown-item.tsx
var rating_dropdown_item_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var rating_dropdown_item_RatingDropdownItem = /** @class */ (function (_super) {
    rating_dropdown_item_extends(RatingDropdownItem, _super);
    function RatingDropdownItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(RatingDropdownItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    RatingDropdownItem.prototype.getStateElement = function () {
        return this.item;
    };
    RatingDropdownItem.prototype.render = function () {
        if (!this.item)
            return null;
        var item = this.props.item;
        var description = this.renderDescription(item);
        return (xn.createElement("div", { className: "sd-rating-dropdown-item" },
            xn.createElement("span", { className: "sd-rating-dropdown-item_text" }, item.title),
            description));
    };
    RatingDropdownItem.prototype.renderDescription = function (item) {
        if (!item.description)
            return null;
        return (xn.createElement("div", { className: "sd-rating-dropdown-item_description" }, this.renderLocString(item.description, undefined, "locString")));
    };
    return RatingDropdownItem;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-rating-dropdown-item", function (props) {
    return xn.createElement(rating_dropdown_item_RatingDropdownItem, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/tagbox-filter.tsx
var tagbox_filter_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var tagbox_filter_TagboxFilterString = /** @class */ (function (_super) {
    tagbox_filter_extends(TagboxFilterString, _super);
    function TagboxFilterString(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(TagboxFilterString.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TagboxFilterString.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    TagboxFilterString.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.updateDomElement();
    };
    TagboxFilterString.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.updateDomElement();
    };
    TagboxFilterString.prototype.updateDomElement = function () {
        if (!!this.inputElement) {
            var control = this.inputElement;
            var newValue = this.model.inputStringRendered;
            if (!external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["Helpers"].isTwoValueEquals(newValue, control.value, false, true, false)) {
                control.value = this.model.inputStringRendered;
            }
        }
    };
    TagboxFilterString.prototype.onChange = function (e) {
        var root = external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].environment.root;
        if (e.target === root.activeElement) {
            this.model.inputStringRendered = e.target.value;
        }
    };
    TagboxFilterString.prototype.keyhandler = function (e) {
        this.model.inputKeyHandler(e);
    };
    TagboxFilterString.prototype.onBlur = function (e) {
        this.question.onBlur(e);
    };
    TagboxFilterString.prototype.onFocus = function (e) {
        this.question.onFocus(e);
    };
    TagboxFilterString.prototype.getStateElement = function () {
        return this.model;
    };
    TagboxFilterString.prototype.render = function () {
        var _this = this;
        return (_("div", { className: this.question.cssClasses.hint },
            this.model.showHintPrefix ?
                (_("div", { className: this.question.cssClasses.hintPrefix },
                    _("span", null, this.model.hintStringPrefix))) : null,
            _("div", { className: this.question.cssClasses.hintSuffixWrapper },
                this.model.showHintString ?
                    (_("div", { className: this.question.cssClasses.hintSuffix },
                        _("span", { style: { visibility: "hidden" }, "data-bind": "text: model.filterString" }, this.model.inputStringRendered),
                        _("span", null, this.model.hintStringSuffix))) : null,
                _("input", { type: "text", autoComplete: "off", id: this.question.getInputId(), inputMode: this.model.inputMode, ref: function (element) { return (_this.inputElement = element); }, className: this.question.cssClasses.filterStringInput, disabled: this.question.isInputReadOnly, readOnly: this.model.filterReadOnly ? true : undefined, size: !this.model.inputStringRendered ? 1 : undefined, role: this.model.filterStringEnabled ? this.question.ariaRole : undefined, "aria-expanded": this.question.ariaExpanded, "aria-label": this.question.a11y_input_ariaLabel, "aria-labelledby": this.question.a11y_input_ariaLabelledBy, "aria-describedby": this.question.a11y_input_ariaDescribedBy, "aria-controls": this.model.listElementId, "aria-activedescendant": this.model.ariaActivedescendant, placeholder: this.model.filterStringPlaceholder, onKeyDown: function (e) { _this.keyhandler(e); }, onChange: function (e) { _this.onChange(e); }, onBlur: function (e) { _this.onBlur(e); }, onFocus: function (e) { _this.onFocus(e); } }))));
    };
    return TagboxFilterString;
}(reactquestion_element_SurveyElementBase));

ReactQuestionFactory.Instance.registerQuestion("sv-tagbox-filter", function (props) {
    return _(tagbox_filter_TagboxFilterString, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/dropdown-item.tsx
var dropdown_item_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var dropdown_item_SurveyQuestionOptionItem = /** @class */ (function (_super) {
    dropdown_item_extends(SurveyQuestionOptionItem, _super);
    function SurveyQuestionOptionItem(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { changed: 0 };
        _this.setupModel();
        return _this;
    }
    SurveyQuestionOptionItem.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.setupModel();
    };
    SurveyQuestionOptionItem.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.setupModel();
    };
    SurveyQuestionOptionItem.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (!!this.item) {
            this.item.locText.onChanged = function () { };
        }
    };
    SurveyQuestionOptionItem.prototype.setupModel = function () {
        if (!this.item.locText)
            return;
        var self = this;
        this.item.locText.onChanged = function () {
            self.setState({ changed: self.state.changed + 1 });
        };
    };
    SurveyQuestionOptionItem.prototype.getStateElement = function () {
        return this.item;
    };
    Object.defineProperty(SurveyQuestionOptionItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionOptionItem.prototype.canRender = function () {
        return !!this.item;
    };
    SurveyQuestionOptionItem.prototype.renderElement = function () {
        return (_("option", { value: this.item.value, disabled: !this.item.isEnabled }, this.item.text));
    };
    return SurveyQuestionOptionItem;
}(ReactSurveyElement));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/dropdown-base.tsx
var dropdown_base_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







var dropdown_base_SurveyQuestionDropdownBase = /** @class */ (function (_super) {
    dropdown_base_extends(SurveyQuestionDropdownBase, _super);
    function SurveyQuestionDropdownBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.click = function (event) {
            var _a;
            (_a = _this.question.dropdownListModel) === null || _a === void 0 ? void 0 : _a.onClick(event);
        };
        _this.chevronPointerDown = function (event) {
            var _a;
            (_a = _this.question.dropdownListModel) === null || _a === void 0 ? void 0 : _a.chevronPointerDown(event);
        };
        _this.clear = function (event) {
            var _a;
            (_a = _this.question.dropdownListModel) === null || _a === void 0 ? void 0 : _a.onClear(event);
        };
        _this.keyhandler = function (event) {
            var _a;
            (_a = _this.question.dropdownListModel) === null || _a === void 0 ? void 0 : _a.keyHandler(event);
        };
        _this.blur = function (event) {
            _this.updateInputDomElement();
            _this.question.onBlur(event);
        };
        _this.focus = function (event) {
            _this.question.onFocus(event);
        };
        return _this;
    }
    SurveyQuestionDropdownBase.prototype.getStateElement = function () {
        return this.question["dropdownListModel"];
    };
    SurveyQuestionDropdownBase.prototype.setValueCore = function (newValue) {
        this.questionBase.renderedValue = newValue;
    };
    SurveyQuestionDropdownBase.prototype.getValueCore = function () {
        return this.questionBase.renderedValue;
    };
    SurveyQuestionDropdownBase.prototype.renderReadOnlyElement = function () {
        return _("div", null, this.question.readOnlyText);
    };
    SurveyQuestionDropdownBase.prototype.renderSelect = function (cssClasses) {
        var _a, _b;
        var selectElement = null;
        if (this.question.isReadOnly) {
            var text = (this.question.selectedItemLocText) ? this.renderLocString(this.question.selectedItemLocText) : "";
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            selectElement = _("div", { id: this.question.inputId, "aria-label": this.question.a11y_input_ariaLabel, "aria-labelledby": this.question.a11y_input_ariaLabelledBy, "aria-describedby": this.question.a11y_input_ariaDescribedBy, tabIndex: this.question.isDisabledAttr ? undefined : 0, className: this.question.getControlClass() },
                text,
                this.renderReadOnlyElement());
        }
        else {
            selectElement = _(b, null,
                this.renderInput(this.question["dropdownListModel"]),
                _(popup_Popup, { model: (_b = (_a = this.question) === null || _a === void 0 ? void 0 : _a.dropdownListModel) === null || _b === void 0 ? void 0 : _b.popupModel }));
        }
        return (_("div", { className: cssClasses.selectWrapper, onClick: this.click },
            selectElement,
            this.createChevronButton()));
    };
    SurveyQuestionDropdownBase.prototype.renderValueElement = function (dropdownListModel) {
        if (this.question.showInputFieldComponent) {
            return ReactElementFactory.Instance.createElement(this.question.inputFieldComponentName, { item: dropdownListModel.getSelectedAction(), question: this.question });
        }
        else if (this.question.showSelectedItemLocText) {
            return this.renderLocString(this.question.selectedItemLocText);
        }
        return null;
    };
    SurveyQuestionDropdownBase.prototype.renderInput = function (dropdownListModel) {
        var _this = this;
        var valueElement = this.renderValueElement(dropdownListModel);
        var root = external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].environment.root;
        var onInputChange = function (e) {
            if (e.target === root.activeElement) {
                dropdownListModel.inputStringRendered = e.target.value;
            }
        };
        return (_("div", { id: this.question.inputId, className: this.question.getControlClass(), tabIndex: dropdownListModel.noTabIndex ? undefined : 0, 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            disabled: this.question.isDisabledAttr, required: this.question.isRequired, onKeyDown: this.keyhandler, onBlur: this.blur, onFocus: this.focus, role: this.question.ariaRole, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage, "aria-expanded": this.question.ariaExpanded, "aria-controls": dropdownListModel.listElementId, "aria-activedescendant": dropdownListModel.ariaActivedescendant },
            dropdownListModel.showHintPrefix ?
                (_("div", { className: this.question.cssClasses.hintPrefix },
                    _("span", null, dropdownListModel.hintStringPrefix))) : null,
            _("div", { className: this.question.cssClasses.controlValue },
                dropdownListModel.showHintString ?
                    (_("div", { className: this.question.cssClasses.hintSuffix },
                        _("span", { style: { visibility: "hidden" }, "data-bind": "text: model.filterString" }, dropdownListModel.inputStringRendered),
                        _("span", null, dropdownListModel.hintStringSuffix))) : null,
                valueElement,
                _("input", { type: "text", autoComplete: "off", id: this.question.getInputId(), ref: function (element) { return (_this.inputElement = element); }, className: this.question.cssClasses.filterStringInput, role: dropdownListModel.filterStringEnabled ? this.question.ariaRole : undefined, "aria-expanded": this.question.ariaExpanded, "aria-label": this.question.a11y_input_ariaLabel, "aria-labelledby": this.question.a11y_input_ariaLabelledBy, "aria-describedby": this.question.a11y_input_ariaDescribedBy, "aria-controls": dropdownListModel.listElementId, "aria-activedescendant": dropdownListModel.ariaActivedescendant, placeholder: dropdownListModel.placeholderRendered, readOnly: dropdownListModel.filterReadOnly ? true : undefined, tabIndex: dropdownListModel.noTabIndex ? undefined : -1, disabled: this.question.isDisabledAttr, inputMode: dropdownListModel.inputMode, onChange: function (e) { onInputChange(e); }, onBlur: this.blur, onFocus: this.focus })),
            this.createClearButton()));
    };
    SurveyQuestionDropdownBase.prototype.createClearButton = function () {
        if (!this.question.allowClear || !this.question.cssClasses.cleanButtonIconId)
            return null;
        var style = { display: !this.question.showClearButton ? "none" : "" };
        return (_("div", { className: this.question.cssClasses.cleanButton, style: style, onClick: this.clear, "aria-hidden": "true" },
            _(svg_icon_SvgIcon, { className: this.question.cssClasses.cleanButtonSvg, iconName: this.question.cssClasses.cleanButtonIconId, title: this.question.clearCaption, size: "auto" })));
    };
    SurveyQuestionDropdownBase.prototype.createChevronButton = function () {
        if (!this.question.cssClasses.chevronButtonIconId)
            return null;
        return (_("div", { className: this.question.cssClasses.chevronButton, "aria-hidden": "true", onPointerDown: this.chevronPointerDown },
            _(svg_icon_SvgIcon, { className: this.question.cssClasses.chevronButtonSvg, iconName: this.question.cssClasses.chevronButtonIconId, size: "auto" })));
    };
    SurveyQuestionDropdownBase.prototype.renderOther = function (cssClasses) {
        return (_("div", { className: this.question.getCommentAreaCss(true) },
            _(SurveyQuestionOtherValueItem, { question: this.question, otherCss: cssClasses.other, cssClasses: cssClasses, isDisplayMode: this.isDisplayMode, isOther: true })));
    };
    SurveyQuestionDropdownBase.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.updateInputDomElement();
    };
    SurveyQuestionDropdownBase.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.updateInputDomElement();
    };
    SurveyQuestionDropdownBase.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (this.question.dropdownListModel)
            this.question.dropdownListModel.focused = false;
    };
    SurveyQuestionDropdownBase.prototype.updateInputDomElement = function () {
        if (!!this.inputElement) {
            var control = this.inputElement;
            var newValue = this.question.dropdownListModel.inputStringRendered;
            if (!external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["Helpers"].isTwoValueEquals(newValue, control.value, false, true, false)) {
                control.value = this.question.dropdownListModel.inputStringRendered;
            }
        }
    };
    return SurveyQuestionDropdownBase;
}(reactquestion_element_SurveyQuestionUncontrolledElement));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_dropdown.tsx
var reactquestion_dropdown_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var reactquestion_dropdown_SurveyQuestionDropdown = /** @class */ (function (_super) {
    reactquestion_dropdown_extends(SurveyQuestionDropdown, _super);
    function SurveyQuestionDropdown(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionDropdown.prototype.renderElement = function () {
        var cssClasses = this.question.cssClasses;
        var comment = this.question.isOtherSelected ? this.renderOther(cssClasses) : null;
        var select = this.renderSelect(cssClasses);
        return (_("div", { className: this.question.renderCssRoot },
            select,
            comment));
    };
    return SurveyQuestionDropdown;
}(dropdown_base_SurveyQuestionDropdownBase));

ReactQuestionFactory.Instance.registerQuestion("dropdown", function (props) {
    return _(reactquestion_dropdown_SurveyQuestionDropdown, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/tagbox-item.tsx
var tagbox_item_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var tagbox_item_SurveyQuestionTagboxItem = /** @class */ (function (_super) {
    tagbox_item_extends(SurveyQuestionTagboxItem, _super);
    function SurveyQuestionTagboxItem(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionTagboxItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionTagboxItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionTagboxItem.prototype.canRender = function () {
        return !!this.item && !!this.question;
    };
    SurveyQuestionTagboxItem.prototype.renderElement = function () {
        var _this = this;
        var text = this.renderLocString(this.item.locText);
        var removeItem = function (event) {
            _this.question.dropdownListModel.deselectItem(_this.item.value);
            event.stopPropagation();
        };
        return (_("div", { className: "sv-tagbox__item" },
            _("div", { className: "sv-tagbox__item-text" }, text),
            _("div", { className: this.question.cssClasses.cleanItemButton, onClick: removeItem },
                _(svg_icon_SvgIcon, { className: this.question.cssClasses.cleanItemButtonSvg, iconName: this.question.cssClasses.cleanItemButtonIconId, size: "auto" }))));
    };
    return SurveyQuestionTagboxItem;
}(ReactSurveyElement));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_tagbox.tsx
var reactquestion_tagbox_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var reactquestion_tagbox_SurveyQuestionTagbox = /** @class */ (function (_super) {
    reactquestion_tagbox_extends(SurveyQuestionTagbox, _super);
    function SurveyQuestionTagbox(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionTagbox.prototype.renderItem = function (key, item) {
        var renderedItem = (_(tagbox_item_SurveyQuestionTagboxItem, { key: key, question: this.question, item: item }));
        return renderedItem;
    };
    SurveyQuestionTagbox.prototype.renderInput = function (dropdownListModel) {
        var _this = this;
        var dropdownMultiSelectListModel = dropdownListModel;
        var items = this.question.selectedChoices.map(function (choice, index) { return _this.renderItem("item" + index, choice); });
        return (_("div", { id: this.question.inputId, className: this.question.getControlClass(), tabIndex: dropdownListModel.noTabIndex ? undefined : 0, 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            disabled: this.question.isInputReadOnly, required: this.question.isRequired, onKeyDown: this.keyhandler, onBlur: this.blur, role: this.question.ariaRole, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage, "aria-expanded": this.question.ariaExpanded, "aria-controls": dropdownListModel.listElementId, "aria-activedescendant": dropdownListModel.ariaActivedescendant },
            _("div", { className: this.question.cssClasses.controlValue },
                items,
                _(tagbox_filter_TagboxFilterString, { model: dropdownMultiSelectListModel, question: this.question })),
            this.createClearButton()));
    };
    SurveyQuestionTagbox.prototype.renderElement = function () {
        var cssClasses = this.question.cssClasses;
        var comment = this.question.isOtherSelected ? this.renderOther(cssClasses) : null;
        var select = this.renderSelect(cssClasses);
        return (_("div", { className: this.question.renderCssRoot },
            select,
            comment));
    };
    SurveyQuestionTagbox.prototype.renderReadOnlyElement = function () {
        if (this.question.locReadOnlyText) {
            return this.renderLocString(this.question.locReadOnlyText);
        }
        else {
            return null;
        }
    };
    return SurveyQuestionTagbox;
}(dropdown_base_SurveyQuestionDropdownBase));

ReactQuestionFactory.Instance.registerQuestion("tagbox", function (props) {
    return _(reactquestion_tagbox_SurveyQuestionTagbox, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/dropdown-select.tsx
var dropdown_select_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var dropdown_select_SurveyQuestionDropdownSelect = /** @class */ (function (_super) {
    dropdown_select_extends(SurveyQuestionDropdownSelect, _super);
    function SurveyQuestionDropdownSelect(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionDropdownSelect.prototype.renderSelect = function (cssClasses) {
        var _this = this;
        var click = function (event) {
            _this.question.onClick(event);
        };
        var keyup = function (event) {
            _this.question.onKeyUp(event);
        };
        var selectElement = this.isDisplayMode ? (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _("div", { id: this.question.inputId, className: this.question.getControlClass(), disabled: true }, this.question.readOnlyText)) :
            (_("select", { id: this.question.inputId, className: this.question.getControlClass(), ref: function (select) { return (_this.setControl(select)); }, autoComplete: this.question.autocomplete, onChange: this.updateValueOnEvent, onInput: this.updateValueOnEvent, onClick: click, onKeyUp: keyup, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage, required: this.question.isRequired },
                this.question.allowClear ? (_("option", { value: "" }, this.question.placeholder)) : null,
                this.question.visibleChoices.map(function (item, i) { return _(dropdown_item_SurveyQuestionOptionItem, { key: "item" + i, item: item }); })));
        return (_("div", { className: cssClasses.selectWrapper },
            selectElement,
            this.createChevronButton()));
    };
    return SurveyQuestionDropdownSelect;
}(reactquestion_dropdown_SurveyQuestionDropdown));

ReactQuestionFactory.Instance.registerQuestion("sv-dropdown-select", function (props) {
    return _(dropdown_select_SurveyQuestionDropdownSelect, props);
});
external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["RendererFactory"].Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_matrix.tsx
var reactquestion_matrix_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var reactquestion_matrix_SurveyQuestionMatrix = /** @class */ (function (_super) {
    reactquestion_matrix_extends(SurveyQuestionMatrix, _super);
    function SurveyQuestionMatrix(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { rowsChanged: 0 };
        return _this;
    }
    Object.defineProperty(SurveyQuestionMatrix.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrix.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (this.question) {
            var self = this;
            this.question.visibleRowsChangedCallback = function () {
                self.setState({ rowsChanged: self.state.rowsChanged + 1 });
            };
        }
    };
    SurveyQuestionMatrix.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (this.question) {
            this.question.visibleRowsChangedCallback = null;
        }
    };
    SurveyQuestionMatrix.prototype.renderElement = function () {
        var _this = this;
        var cssClasses = this.question.cssClasses;
        var rowsTH = this.question.hasRows ? _("td", null) : null;
        var headers = [];
        for (var i = 0; i < this.question.visibleColumns.length; i++) {
            var column = this.question.visibleColumns[i];
            var key = "column" + i;
            var columText = this.renderLocString(column.locText);
            var style = {};
            if (!!this.question.columnMinWidth) {
                style.minWidth = this.question.columnMinWidth;
                style.width = this.question.columnMinWidth;
            }
            headers.push(_("th", { className: this.question.cssClasses.headerCell, style: style, key: key }, this.wrapCell({ column: column }, columText, "column-header")));
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            var key = "row-" + row.name + "-" + i;
            rows.push(_(reactquestion_matrix_SurveyQuestionMatrixRow, { key: key, question: this.question, cssClasses: cssClasses, row: row, isFirst: i == 0 }));
        }
        var header = !this.question.showHeader ? null : (_("thead", null,
            _("tr", null,
                rowsTH,
                headers)));
        return (_("div", { className: cssClasses.tableWrapper, ref: function (root) { return (_this.setControl(root)); } },
            _("fieldset", null,
                _("legend", { className: "sv-hidden" }, this.question.locTitle.renderedHtml),
                _("table", { className: this.question.getTableCss() },
                    header,
                    _("tbody", null, rows)))));
    };
    return SurveyQuestionMatrix;
}(reactquestion_element_SurveyQuestionElementBase));

var reactquestion_matrix_SurveyQuestionMatrixRow = /** @class */ (function (_super) {
    reactquestion_matrix_extends(SurveyQuestionMatrixRow, _super);
    function SurveyQuestionMatrixRow(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionMatrixRow.prototype.getStateElement = function () {
        if (!!this.row)
            return this.row.item;
        return _super.prototype.getStateElement.call(this);
    };
    Object.defineProperty(SurveyQuestionMatrixRow.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixRow.prototype, "row", {
        get: function () {
            return this.props.row;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixRow.prototype.wrapCell = function (cell, element, reason) {
        if (!reason) {
            return element;
        }
        var survey = this.question.survey;
        var wrapper = null;
        if (survey) {
            wrapper = reactsurveymodel_ReactSurveyElementsWrapper.wrapMatrixCell(survey, element, cell, reason);
        }
        return wrapper !== null && wrapper !== void 0 ? wrapper : element;
    };
    SurveyQuestionMatrixRow.prototype.canRender = function () {
        return !!this.row;
    };
    SurveyQuestionMatrixRow.prototype.renderElement = function () {
        var rowsTD = null;
        if (this.question.hasRows) {
            var rowText = this.renderLocString(this.row.locText);
            var style = {};
            if (!!this.question.rowTitleWidth) {
                style.minWidth = this.question.rowTitleWidth;
                style.width = this.question.rowTitleWidth;
            }
            rowsTD = _("td", { style: style, className: this.row.rowTextClasses }, this.wrapCell({ row: this.row }, rowText, "row-header"));
        }
        var tds = this.generateTds();
        return (_("tr", { className: this.row.rowClasses || undefined },
            rowsTD,
            tds));
    };
    SurveyQuestionMatrixRow.prototype.generateTds = function () {
        var _this = this;
        var tds = [];
        var row = this.row;
        var cellComponent = this.question.cellComponent;
        var _loop_1 = function () {
            var td = null;
            var column = this_1.question.visibleColumns[i];
            var key = "value" + i;
            var itemClass = this_1.question.getItemClass(row, column);
            if (this_1.question.hasCellText) {
                var getHandler = function (column) { return function () { return _this.cellClick(row, column); }; };
                td = (_("td", { key: key, className: itemClass, onClick: getHandler ? getHandler(column) : function () { } }, this_1.renderLocString(this_1.question.getCellDisplayLocText(row.name, column))));
            }
            else {
                var renderedCell = ReactElementFactory.Instance.createElement(cellComponent, {
                    question: this_1.question,
                    row: this_1.row,
                    column: column,
                    columnIndex: i,
                    cssClasses: this_1.cssClasses,
                    cellChanged: function () { _this.cellClick(_this.row, column); }
                });
                td = (_("td", { key: key, "data-responsive-title": column.locText.renderedHtml, className: this_1.question.cssClasses.cell }, renderedCell));
            }
            tds.push(td);
        };
        var this_1 = this;
        for (var i = 0; i < this.question.visibleColumns.length; i++) {
            _loop_1();
        }
        return tds;
    };
    SurveyQuestionMatrixRow.prototype.cellClick = function (row, column) {
        row.value = column.value;
        this.setState({ value: this.row.value });
    };
    return SurveyQuestionMatrixRow;
}(ReactSurveyElement));

var reactquestion_matrix_SurveyQuestionMatrixCell = /** @class */ (function (_super) {
    reactquestion_matrix_extends(SurveyQuestionMatrixCell, _super);
    function SurveyQuestionMatrixCell(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnMouseDown = _this.handleOnMouseDown.bind(_this);
        _this.handleOnChange = _this.handleOnChange.bind(_this);
        return _this;
    }
    SurveyQuestionMatrixCell.prototype.handleOnChange = function (event) {
        if (!!this.props.cellChanged) {
            this.props.cellChanged();
        }
    };
    SurveyQuestionMatrixCell.prototype.handleOnMouseDown = function (event) {
        this.question.onMouseDown();
    };
    Object.defineProperty(SurveyQuestionMatrixCell.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixCell.prototype, "row", {
        get: function () {
            return this.props.row;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixCell.prototype, "column", {
        get: function () {
            return this.props.column;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixCell.prototype, "columnIndex", {
        get: function () {
            return this.props.columnIndex;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixCell.prototype.canRender = function () {
        return !!this.question && !!this.row;
    };
    SurveyQuestionMatrixCell.prototype.renderElement = function () {
        var isChecked = this.row.value == this.column.value;
        var inputId = this.question.inputId + "_" + this.row.name + "_" + this.columnIndex;
        var itemClass = this.question.getItemClass(this.row, this.column);
        var mobileSpan = this.question.isMobile ?
            (_("span", { className: this.question.cssClasses.cellResponsiveTitle }, this.renderLocString(this.column.locText)))
            : undefined;
        return (_("label", { onMouseDown: this.handleOnMouseDown, className: itemClass },
            this.renderInput(inputId, isChecked),
            _("span", { className: this.question.cssClasses.materialDecorator }, this.question.itemSvgIcon ?
                _("svg", { className: this.cssClasses.itemDecorator },
                    _("use", { xlinkHref: this.question.itemSvgIcon })) :
                null),
            mobileSpan));
    };
    SurveyQuestionMatrixCell.prototype.renderInput = function (inputId, isChecked) {
        return (_("input", { id: inputId, type: "radio", className: this.cssClasses.itemValue, name: this.row.fullName, value: this.column.value, disabled: this.row.isDisabledAttr, readOnly: this.row.isReadOnlyAttr, checked: isChecked, onChange: this.handleOnChange, "aria-required": this.question.a11y_input_ariaRequired, "aria-label": this.question.getCellAriaLabel(this.row.locText.renderedHtml, this.column.locText.renderedHtml), "aria-invalid": this.question.a11y_input_ariaInvalid, "aria-errormessage": this.question.a11y_input_ariaErrormessage }));
    };
    return SurveyQuestionMatrixCell;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("survey-matrix-cell", function (props) {
    return _(reactquestion_matrix_SurveyQuestionMatrixCell, props);
});
ReactQuestionFactory.Instance.registerQuestion("matrix", function (props) {
    return _(reactquestion_matrix_SurveyQuestionMatrix, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_html.tsx
var reactquestion_html_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var reactquestion_html_SurveyQuestionHtml = /** @class */ (function (_super) {
    reactquestion_html_extends(SurveyQuestionHtml, _super);
    function SurveyQuestionHtml(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionHtml.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionHtml.prototype.componentDidMount = function () {
        this.reactOnStrChanged();
    };
    SurveyQuestionHtml.prototype.componentWillUnmount = function () {
        this.question.locHtml.onChanged = function () { };
    };
    SurveyQuestionHtml.prototype.componentDidUpdate = function (prevProps, prevState) {
        this.reactOnStrChanged();
    };
    SurveyQuestionHtml.prototype.reactOnStrChanged = function () {
        var _this = this;
        this.question.locHtml.onChanged = function () {
            _this.setState({ changed: !!_this.state && _this.state.changed ? _this.state.changed + 1 : 1 });
        };
    };
    SurveyQuestionHtml.prototype.canRender = function () {
        return _super.prototype.canRender.call(this) && !!this.question.html;
    };
    SurveyQuestionHtml.prototype.renderElement = function () {
        var htmlValue = { __html: this.question.locHtml.renderedHtml };
        return (_("div", { className: this.question.renderCssRoot, dangerouslySetInnerHTML: htmlValue }));
    };
    return SurveyQuestionHtml;
}(reactquestion_element_SurveyQuestionElementBase));

ReactQuestionFactory.Instance.registerQuestion("html", function (props) {
    return _(reactquestion_html_SurveyQuestionHtml, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/loading-indicator.tsx
var loading_indicator_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var loading_indicator_LoadingIndicatorComponent = /** @class */ (function (_super) {
    loading_indicator_extends(LoadingIndicatorComponent, _super);
    function LoadingIndicatorComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadingIndicatorComponent.prototype.render = function () {
        return (_("div", { className: "sd-loading-indicator" },
            _(svg_icon_SvgIcon, { iconName: "icon-loading", size: "auto" })));
    };
    return LoadingIndicatorComponent;
}(k));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/file/file-choose-button.tsx
var file_choose_button_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var file_choose_button_SurveyFileChooseButton = /** @class */ (function (_super) {
    file_choose_button_extends(SurveyFileChooseButton, _super);
    function SurveyFileChooseButton(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyFileChooseButton.prototype, "question", {
        get: function () {
            return (this.props.item && this.props.item.data.question) || this.props.data.question;
        },
        enumerable: false,
        configurable: true
    });
    SurveyFileChooseButton.prototype.render = function () {
        var _this = this;
        return attachKey2click(xn.createElement("label", { tabIndex: 0, className: this.question.getChooseFileCss(), htmlFor: this.question.inputId, "aria-label": this.question.chooseButtonText, onClick: function (e) { return _this.question.chooseFile(e.nativeEvent); } },
            (!!this.question.cssClasses.chooseFileIconId) ? xn.createElement(svg_icon_SvgIcon, { title: this.question.chooseButtonText, iconName: this.question.cssClasses.chooseFileIconId, size: "auto" }) : null,
            xn.createElement("span", null, this.question.chooseButtonText)));
    };
    return SurveyFileChooseButton;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("sv-file-choose-btn", function (props) {
    return xn.createElement(file_choose_button_SurveyFileChooseButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_file.tsx
var reactquestion_file_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();









// import { ReactElementFactory, SurveyFileChooseButton } from "../entries/react-ui-model";
var reactquestion_file_SurveyQuestionFile = /** @class */ (function (_super) {
    reactquestion_file_extends(SurveyQuestionFile, _super);
    function SurveyQuestionFile(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionFile.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionFile.prototype.renderElement = function () {
        var _this = this;
        var preview = this.question.allowShowPreview ? this.renderPreview() : null;
        var loadingIndicator = this.question.showLoadingIndicator ? this.renderLoadingIndicator() : null;
        var video = this.question.isPlayingVideo ? this.renderVideo() : null;
        var fileDecorator = this.question.showFileDecorator ? this.renderFileDecorator() : null;
        var clearButton = this.question.showRemoveButton ? this.renderClearButton(this.question.cssClasses.removeButton) : null;
        var clearButtonBottom = this.question.showRemoveButtonBottom ? this.renderClearButton(this.question.cssClasses.removeButtonBottom) : null;
        var fileNavigator = this.question.fileNavigatorVisible ? (_(action_bar_SurveyActionBar, { model: this.question.fileNavigator })) : null;
        var fileInput;
        if (this.question.isReadOnlyAttr) {
            fileInput = _("input", { readOnly: true, type: "file", className: !this.isDisplayMode ? this.question.cssClasses.fileInput : this.question.getReadOnlyFileCss(), id: this.question.inputId, ref: function (input) { return (_this.setControl(input)); }, style: !this.isDisplayMode ? {} : { color: "transparent" }, multiple: this.question.allowMultiple, placeholder: this.question.title, accept: this.question.acceptedTypes });
        }
        else if (this.question.isDisabledAttr) {
            fileInput = _("input", { disabled: true, type: "file", className: !this.isDisplayMode ? this.question.cssClasses.fileInput : this.question.getReadOnlyFileCss(), id: this.question.inputId, ref: function (input) { return (_this.setControl(input)); }, style: !this.isDisplayMode ? {} : { color: "transparent" }, multiple: this.question.allowMultiple, placeholder: this.question.title, accept: this.question.acceptedTypes });
        }
        else if (this.question.hasFileUI) {
            fileInput = _("input", { type: "file", disabled: this.isDisplayMode, tabIndex: -1, className: !this.isDisplayMode ? this.question.cssClasses.fileInput : this.question.getReadOnlyFileCss(), id: this.question.inputId, ref: function (input) { return (_this.setControl(input)); }, style: !this.isDisplayMode ? {} : { color: "transparent" }, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage, multiple: this.question.allowMultiple, title: this.question.inputTitle, accept: this.question.acceptedTypes, capture: this.question.renderCapture });
        }
        else {
            fileInput = null;
        }
        return (_("div", { className: this.question.fileRootCss, ref: function (el) { return (_this.setContent(el)); } },
            fileInput,
            _("div", { className: this.question.cssClasses.dragArea, onDrop: this.question.onDrop, onDragOver: this.question.onDragOver, onDragLeave: this.question.onDragLeave, onDragEnter: this.question.onDragEnter },
                fileDecorator,
                loadingIndicator,
                video,
                clearButton,
                preview,
                clearButtonBottom,
                fileNavigator)));
    };
    SurveyQuestionFile.prototype.renderFileDecorator = function () {
        var chooseButton = this.question.showChooseButton ? this.renderChooseButton() : null;
        var actionsContainer = this.question.actionsContainerVisible ? _(action_bar_SurveyActionBar, { model: this.question.actionsContainer }) : null;
        var noFileChosen = this.question.isEmpty() ? (_("span", { className: this.question.cssClasses.noFileChosen }, this.question.noFileChosenCaption)) : null;
        return (_("div", { className: this.question.getFileDecoratorCss() },
            _("span", { className: this.question.cssClasses.dragAreaPlaceholder }, this.renderLocString(this.question.locRenderedPlaceholder)),
            _("div", { className: this.question.cssClasses.wrapper },
                chooseButton,
                actionsContainer,
                noFileChosen)));
    };
    SurveyQuestionFile.prototype.renderChooseButton = function () {
        return _(file_choose_button_SurveyFileChooseButton, { data: { question: this.question } });
    };
    SurveyQuestionFile.prototype.renderClearButton = function (className) {
        return !this.question.isUploading ? (_("button", { type: "button", onClick: this.question.doClean, className: className },
            _("span", null, this.question.clearButtonCaption),
            (!!this.question.cssClasses.removeButtonIconId) ? _(svg_icon_SvgIcon, { iconName: this.question.cssClasses.removeButtonIconId, size: "auto", title: this.question.clearButtonCaption }) : null)) : null;
    };
    SurveyQuestionFile.prototype.renderPreview = function () {
        return ReactElementFactory.Instance.createElement("sv-file-preview", { question: this.question });
    };
    SurveyQuestionFile.prototype.renderLoadingIndicator = function () {
        return _("div", { className: this.question.cssClasses.loadingIndicator },
            _(loading_indicator_LoadingIndicatorComponent, null));
    };
    SurveyQuestionFile.prototype.renderVideo = function () {
        return (_("div", { className: this.question.cssClasses.videoContainer },
            _(action_bar_item_SurveyAction, { item: this.question.changeCameraAction }),
            _(action_bar_item_SurveyAction, { item: this.question.closeCameraAction }),
            _("video", { autoPlay: true, playsInline: true, id: this.question.videoId, className: this.question.cssClasses.video }),
            _(action_bar_item_SurveyAction, { item: this.question.takePictureAction })));
    };
    return SurveyQuestionFile;
}(reactquestion_element_SurveyQuestionElementBase));

ReactQuestionFactory.Instance.registerQuestion("file", function (props) {
    return _(reactquestion_file_SurveyQuestionFile, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/file/file-item.tsx
var file_item_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var file_item_SurveyFileItem = /** @class */ (function (_super) {
    file_item_extends(SurveyFileItem, _super);
    function SurveyFileItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyFileItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyFileItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyFileItem.prototype.renderFileSign = function (className, val) {
        var _this = this;
        if (!className || !val.name)
            return null;
        return (xn.createElement("div", { className: className },
            xn.createElement("a", { href: val.content, onClick: function (event) {
                    _this.question.doDownloadFile(event, val);
                }, title: val.name, download: val.name, style: { width: this.question.imageWidth } }, val.name)));
    };
    SurveyFileItem.prototype.renderElement = function () {
        var _this = this;
        var val = this.item;
        return (xn.createElement("span", { className: this.question.cssClasses.previewItem, onClick: function (event) { return _this.question.doDownloadFileFromContainer(event); } },
            this.renderFileSign(this.question.cssClasses.fileSign, val),
            xn.createElement("div", { className: this.question.getImageWrapperCss(val) },
                this.question.canPreviewImage(val) ? (xn.createElement("img", { src: val.content, style: { height: this.question.imageHeight, width: this.question.imageWidth }, alt: "File preview" })) : (this.question.cssClasses.defaultImage ? (xn.createElement(svg_icon_SvgIcon, { iconName: this.question.cssClasses.defaultImageIconId, size: "auto", className: this.question.cssClasses.defaultImage })) : null),
                val.name && !this.question.isReadOnly ? (xn.createElement("div", { className: this.question.getRemoveButtonCss(), onClick: function (event) { return _this.question.doRemoveFile(val, event); } },
                    xn.createElement("span", { className: this.question.cssClasses.removeFile }, this.question.removeFileCaption),
                    (this.question.cssClasses.removeFileSvgIconId) ?
                        (xn.createElement(svg_icon_SvgIcon, { title: this.question.removeFileCaption, iconName: this.question.cssClasses.removeFileSvgIconId, size: "auto", className: this.question.cssClasses.removeFileSvg })) : null)) : null),
            this.renderFileSign(this.question.cssClasses.fileSignBottom, val)));
    };
    SurveyFileItem.prototype.canRender = function () {
        return this.question.showPreviewContainer;
    };
    return SurveyFileItem;
}(reactquestion_element_SurveyElementBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/file/file-page.tsx
var file_page_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var file_page_SurveyFilePage = /** @class */ (function (_super) {
    file_page_extends(SurveyFilePage, _super);
    function SurveyFilePage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyFilePage.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyFilePage.prototype, "page", {
        get: function () {
            return this.props.page;
        },
        enumerable: false,
        configurable: true
    });
    SurveyFilePage.prototype.renderElement = function () {
        var _this = this;
        var items = this.page.items.map(function (item, index) { return (xn.createElement(file_item_SurveyFileItem, { item: item, question: _this.question, key: index })); });
        return (xn.createElement("div", { className: this.page.css, id: this.page.id }, items));
    };
    return SurveyFilePage;
}(reactquestion_element_SurveyElementBase));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/file/file-preview.tsx
var file_preview_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var file_preview_SurveyFilePreview = /** @class */ (function (_super) {
    file_preview_extends(SurveyFilePreview, _super);
    function SurveyFilePreview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyFilePreview.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    SurveyFilePreview.prototype.renderFileSign = function (className, val) {
        var _this = this;
        if (!className || !val.name)
            return null;
        return (xn.createElement("div", { className: className },
            xn.createElement("a", { href: val.content, onClick: function (event) {
                    _this.question.doDownloadFile(event, val);
                }, title: val.name, download: val.name, style: { width: this.question.imageWidth } }, val.name)));
    };
    SurveyFilePreview.prototype.renderElement = function () {
        var _this = this;
        var content = this.question.supportFileNavigator ? this.question.renderedPages.map(function (page, index) { return (xn.createElement(file_page_SurveyFilePage, { page: page, question: _this.question, key: page.id })); })
            : this.question.previewValue.map(function (item, index) { return (xn.createElement(file_item_SurveyFileItem, { item: item, question: _this.question, key: index })); });
        return xn.createElement("div", { className: this.question.cssClasses.fileList || undefined }, content);
    };
    SurveyFilePreview.prototype.canRender = function () {
        return this.question.showPreviewContainer;
    };
    return SurveyFilePreview;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-file-preview", function (props) {
    return xn.createElement(file_preview_SurveyFilePreview, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_multipletext.tsx
var reactquestion_multipletext_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var reactquestion_multipletext_SurveyQuestionMultipleText = /** @class */ (function (_super) {
    reactquestion_multipletext_extends(SurveyQuestionMultipleText, _super);
    function SurveyQuestionMultipleText(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionMultipleText.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMultipleText.prototype.renderElement = function () {
        var cssClasses = this.question.cssClasses;
        var tableRows = this.question.getRows();
        var rows = [];
        for (var i = 0; i < tableRows.length; i++) {
            if (tableRows[i].isVisible) {
                rows.push(this.renderRow(i, tableRows[i].cells, cssClasses));
            }
        }
        return (_("table", { className: this.question.getQuestionRootCss() },
            _("tbody", null, rows)));
    };
    SurveyQuestionMultipleText.prototype.renderCell = function (cell, cssClasses, index) {
        var cellContent;
        var focusIn = function () { cell.item.focusIn(); };
        if (cell.isErrorsCell) {
            cellContent = _(reactquestion_SurveyQuestionErrorCell, { question: cell.item.editor, creator: this.creator });
        }
        else {
            cellContent = _(reactquestion_multipletext_SurveyMultipleTextItem, { question: this.question, item: cell.item, creator: this.creator, cssClasses: cssClasses });
        }
        return (_("td", { key: "item" + index, className: cell.className, onFocus: focusIn }, cellContent));
    };
    SurveyQuestionMultipleText.prototype.renderRow = function (rowIndex, cells, cssClasses) {
        var key = "item" + rowIndex;
        var tds = [];
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            tds.push(this.renderCell(cell, cssClasses, i));
        }
        return (_("tr", { key: key, className: cssClasses.row }, tds));
    };
    return SurveyQuestionMultipleText;
}(reactquestion_element_SurveyQuestionElementBase));

var reactquestion_multipletext_SurveyMultipleTextItem = /** @class */ (function (_super) {
    reactquestion_multipletext_extends(SurveyMultipleTextItem, _super);
    function SurveyMultipleTextItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyMultipleTextItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyMultipleTextItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyMultipleTextItem.prototype.getStateElements = function () {
        return [this.item, this.item.editor];
    };
    Object.defineProperty(SurveyMultipleTextItem.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    SurveyMultipleTextItem.prototype.renderElement = function () {
        var item = this.item;
        var cssClasses = this.cssClasses;
        var titleStyle = {};
        if (!!this.question.itemTitleWidth) {
            titleStyle.minWidth = this.question.itemTitleWidth;
            titleStyle.width = this.question.itemTitleWidth;
        }
        return (_("label", { className: this.question.getItemLabelCss(item) },
            _("span", { className: cssClasses.itemTitle, style: titleStyle },
                _(title_content_TitleContent, { element: item.editor, cssClasses: item.editor.cssClasses })),
            _(reactquestion_multipletext_SurveyMultipleTextItemEditor, { cssClasses: cssClasses, itemCss: this.question.getItemCss(), question: item.editor, creator: this.creator })));
    };
    return SurveyMultipleTextItem;
}(ReactSurveyElement));

var reactquestion_multipletext_SurveyMultipleTextItemEditor = /** @class */ (function (_super) {
    reactquestion_multipletext_extends(SurveyMultipleTextItemEditor, _super);
    function SurveyMultipleTextItemEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SurveyMultipleTextItemEditor.prototype.renderElement = function () {
        return _("div", { className: this.itemCss }, this.renderContent());
    };
    return SurveyMultipleTextItemEditor;
}(reactquestion_SurveyQuestionAndErrorsWrapped));

ReactQuestionFactory.Instance.registerQuestion("multipletext", function (props) {
    return _(reactquestion_multipletext_SurveyQuestionMultipleText, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_radiogroup.tsx
var reactquestion_radiogroup_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var reactquestion_radiogroup_SurveyQuestionRadiogroup = /** @class */ (function (_super) {
    reactquestion_radiogroup_extends(SurveyQuestionRadiogroup, _super);
    function SurveyQuestionRadiogroup(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionRadiogroup.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionRadiogroup.prototype.renderElement = function () {
        var _this = this;
        var cssClasses = this.question.cssClasses;
        var clearButton = null;
        if (this.question.showClearButtonInContent) {
            clearButton = (_("div", null,
                _("input", { type: "button", className: this.question.cssClasses.clearButton, onClick: function () { return _this.question.clearValue(true); }, value: this.question.clearButtonCaption })));
        }
        return (_("fieldset", { className: this.question.getSelectBaseRootCss(), ref: function (fieldset) { return (_this.setControl(fieldset)); }, role: this.question.a11y_input_ariaRole, "aria-required": this.question.a11y_input_ariaRequired, "aria-label": this.question.a11y_input_ariaLabel, "aria-labelledby": this.question.a11y_input_ariaLabelledBy, "aria-describedby": this.question.a11y_input_ariaDescribedBy, "aria-invalid": this.question.a11y_input_ariaInvalid, "aria-errormessage": this.question.a11y_input_ariaErrormessage },
            this.question.hasColumns
                ? this.getColumnedBody(cssClasses)
                : this.getBody(cssClasses),
            this.getFooter(),
            this.question.isOtherSelected ? this.renderOther(cssClasses) : null,
            clearButton));
    };
    SurveyQuestionRadiogroup.prototype.getFooter = function () {
        var _this = this;
        if (this.question.hasFootItems) {
            return this.question.footItems.map(function (item, ii) {
                return _this.renderItem(item, false, _this.question.cssClasses);
            });
        }
    };
    SurveyQuestionRadiogroup.prototype.getColumnedBody = function (cssClasses) {
        return (_("div", { className: cssClasses.rootMultiColumn }, this.getColumns(cssClasses)));
    };
    SurveyQuestionRadiogroup.prototype.getColumns = function (cssClasses) {
        var _this = this;
        var value = this.getStateValue();
        return this.question.columns.map(function (column, ci) {
            var items = column.map(function (item, ii) {
                return _this.renderItem(item, value, cssClasses, "" + ci + ii);
            });
            return (_("div", { key: "column" + ci + _this.question.getItemsColumnKey(column), className: _this.question.getColumnClass(), role: "presentation" }, items));
        });
    };
    SurveyQuestionRadiogroup.prototype.getBody = function (cssClasses) {
        if (this.question.blockedRow) {
            return _("div", { className: cssClasses.rootRow }, this.getItems(cssClasses, this.question.dataChoices));
        }
        else
            return _(b, null, this.getItems(cssClasses, this.question.bodyItems));
    };
    SurveyQuestionRadiogroup.prototype.getItems = function (cssClasses, choices) {
        var items = [];
        var value = this.getStateValue();
        for (var i = 0; i < choices.length; i++) {
            var item = choices[i];
            var renderedItem = this.renderItem(item, value, cssClasses, "" + i);
            items.push(renderedItem);
        }
        return items;
    };
    Object.defineProperty(SurveyQuestionRadiogroup.prototype, "textStyle", {
        get: function () {
            return null; //{ display: "inline", position: "static" };
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionRadiogroup.prototype.renderOther = function (cssClasses) {
        return (_("div", { className: this.question.getCommentAreaCss(true) },
            _(SurveyQuestionOtherValueItem, { question: this.question, otherCss: cssClasses.other, cssClasses: cssClasses, isDisplayMode: this.isDisplayMode })));
    };
    SurveyQuestionRadiogroup.prototype.renderItem = function (item, value, cssClasses, index) {
        var renderedItem = ReactElementFactory.Instance.createElement(this.question.itemComponent, {
            key: item.value,
            question: this.question,
            cssClasses: cssClasses,
            isDisplayMode: this.isDisplayMode,
            item: item,
            textStyle: this.textStyle,
            index: index,
            isChecked: value === item.value,
        });
        var survey = this.question.survey;
        var wrappedItem = null;
        if (!!survey) {
            wrappedItem = reactsurveymodel_ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
        }
        return wrappedItem !== null && wrappedItem !== void 0 ? wrappedItem : renderedItem;
    };
    SurveyQuestionRadiogroup.prototype.getStateValue = function () {
        return !this.question.isEmpty() ? this.question.renderedValue : "";
    };
    return SurveyQuestionRadiogroup;
}(reactquestion_element_SurveyQuestionElementBase));

var reactquestion_radiogroup_SurveyQuestionRadioItem = /** @class */ (function (_super) {
    reactquestion_radiogroup_extends(SurveyQuestionRadioItem, _super);
    function SurveyQuestionRadioItem(props) {
        var _this = _super.call(this, props) || this;
        _this.rootRef = m();
        _this.handleOnChange = _this.handleOnChange.bind(_this);
        _this.handleOnMouseDown = _this.handleOnMouseDown.bind(_this);
        return _this;
    }
    SurveyQuestionRadioItem.prototype.getStateElement = function () {
        return this.item;
    };
    Object.defineProperty(SurveyQuestionRadioItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRadioItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRadioItem.prototype, "textStyle", {
        get: function () {
            return this.props.textStyle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRadioItem.prototype, "index", {
        get: function () {
            return this.props.index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRadioItem.prototype, "isChecked", {
        get: function () {
            return this.props.isChecked;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionRadioItem.prototype, "hideCaption", {
        get: function () {
            return this.props.hideCaption === true;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionRadioItem.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (!_super.prototype.shouldComponentUpdate.call(this, nextProps, nextState))
            return false;
        if (!this.question)
            return false;
        return (!this.question.customWidget ||
            !!this.question.customWidgetData.isNeedRender ||
            !!this.question.customWidget.widgetJson.isDefaultRender ||
            !!this.question.customWidget.widgetJson.render);
    };
    SurveyQuestionRadioItem.prototype.handleOnChange = function (event) {
        this.question.clickItemHandler(this.item);
    };
    SurveyQuestionRadioItem.prototype.handleOnMouseDown = function (event) {
        this.question.onMouseDown();
    };
    SurveyQuestionRadioItem.prototype.canRender = function () {
        return !!this.question && !!this.item;
    };
    SurveyQuestionRadioItem.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (prevProps.item !== this.props.item && !this.question.isDesignMode) {
            if (this.props.item) {
                this.props.item.setRootElement(this.rootRef.current);
            }
            if (prevProps.item) {
                prevProps.item.setRootElement(undefined);
            }
        }
    };
    SurveyQuestionRadioItem.prototype.renderElement = function () {
        var itemClass = this.question.getItemClass(this.item);
        var labelClass = this.question.getLabelClass(this.item);
        var controlLabelClass = this.question.getControlLabelClass(this.item);
        var itemLabel = !this.hideCaption ? _("span", { className: controlLabelClass }, this.renderLocString(this.item.locText, this.textStyle)) : null;
        return (_("div", { className: itemClass, role: "presentation", ref: this.rootRef },
            _("label", { onMouseDown: this.handleOnMouseDown, className: labelClass },
                _("input", { "aria-errormessage": this.question.ariaErrormessage, className: this.cssClasses.itemControl, id: this.question.getItemId(this.item), type: "radio", name: this.question.questionName, checked: this.isChecked, value: this.item.value, disabled: !this.question.getItemEnabled(this.item), readOnly: this.question.isReadOnlyAttr, onChange: this.handleOnChange }),
                this.cssClasses.materialDecorator ?
                    _("span", { className: this.cssClasses.materialDecorator }, this.question.itemSvgIcon ?
                        _("svg", { className: this.cssClasses.itemDecorator },
                            _("use", { xlinkHref: this.question.itemSvgIcon })) :
                        null) :
                    null,
                itemLabel)));
    };
    SurveyQuestionRadioItem.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (!this.question.isDesignMode) {
            this.item.setRootElement(this.rootRef.current);
        }
    };
    SurveyQuestionRadioItem.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (!this.question.isDesignMode) {
            this.item.setRootElement(undefined);
        }
    };
    return SurveyQuestionRadioItem;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("survey-radiogroup-item", function (props) {
    return _(reactquestion_radiogroup_SurveyQuestionRadioItem, props);
});
ReactQuestionFactory.Instance.registerQuestion("radiogroup", function (props) {
    return _(reactquestion_radiogroup_SurveyQuestionRadiogroup, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_text.tsx
var reactquestion_text_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var reactquestion_text_SurveyQuestionText = /** @class */ (function (_super) {
    reactquestion_text_extends(SurveyQuestionText, _super);
    //controlRef: React.RefObject<HTMLInputElement>;
    function SurveyQuestionText(props) {
        return _super.call(this, props) || this;
        //this.controlRef = React.createRef();
    }
    SurveyQuestionText.prototype.renderInput = function () {
        var _this = this;
        var inputClass = this.question.getControlClass();
        var placeholder = this.question.renderedPlaceholder;
        if (this.question.isReadOnlyRenderDiv()) {
            return _("div", null, this.question.inputValue);
        }
        var counter = !!this.question.getMaxLength() ? (_(character_counter_CharacterCounterComponent, { counter: this.question.characterCounter, remainingCharacterCounter: this.question.cssClasses.remainingCharacterCounter })) : null;
        return (_(b, null,
            _("input", { id: this.question.inputId, 
                // disabled={this.isDisplayMode}
                disabled: this.question.isDisabledAttr, readOnly: this.question.isReadOnlyAttr, className: inputClass, type: this.question.inputType, 
                //ref={this.controlRef}
                ref: function (input) { return (_this.setControl(input)); }, style: this.question.inputStyle, maxLength: this.question.getMaxLength(), min: this.question.renderedMin, max: this.question.renderedMax, step: this.question.renderedStep, size: this.question.inputSize, placeholder: placeholder, list: this.question.dataListId, autoComplete: this.question.autocomplete, onBlur: function (event) { _this.question.onBlur(event); }, onFocus: function (event) { _this.question.onFocus(event); }, onChange: this.question.onChange, onKeyUp: this.question.onKeyUp, onKeyDown: this.question.onKeyDown, onCompositionUpdate: function (event) { return _this.question.onCompositionUpdate(event.nativeEvent); }, "aria-required": this.question.a11y_input_ariaRequired, "aria-label": this.question.a11y_input_ariaLabel, "aria-labelledby": this.question.a11y_input_ariaLabelledBy, "aria-describedby": this.question.a11y_input_ariaDescribedBy, "aria-invalid": this.question.a11y_input_ariaInvalid, "aria-errormessage": this.question.a11y_input_ariaErrormessage }),
            counter));
    };
    SurveyQuestionText.prototype.renderElement = function () {
        return (this.question.dataListId ?
            _("div", null,
                this.renderInput(),
                this.renderDataList()) :
            this.renderInput());
    };
    SurveyQuestionText.prototype.setValueCore = function (newValue) {
        this.question.inputValue = newValue;
    };
    SurveyQuestionText.prototype.getValueCore = function () {
        return this.question.inputValue;
    };
    SurveyQuestionText.prototype.renderDataList = function () {
        if (!this.question.dataListId)
            return null;
        var items = this.question.dataList;
        if (items.length == 0)
            return null;
        var options = [];
        for (var i = 0; i < items.length; i++) {
            options.push(_("option", { key: "item" + i, value: items[i] }));
        }
        return _("datalist", { id: this.question.dataListId }, options);
    };
    return SurveyQuestionText;
}(reactquestion_element_SurveyQuestionUncontrolledElement));

ReactQuestionFactory.Instance.registerQuestion("text", function (props) {
    return _(reactquestion_text_SurveyQuestionText, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/boolean.tsx
var boolean_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var boolean_SurveyQuestionBoolean = /** @class */ (function (_super) {
    boolean_extends(SurveyQuestionBoolean, _super);
    function SurveyQuestionBoolean(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnChange = _this.handleOnChange.bind(_this);
        _this.handleOnClick = _this.handleOnClick.bind(_this);
        _this.handleOnLabelClick = _this.handleOnLabelClick.bind(_this);
        _this.handleOnSwitchClick = _this.handleOnSwitchClick.bind(_this);
        _this.handleOnKeyDown = _this.handleOnKeyDown.bind(_this);
        _this.checkRef = m();
        return _this;
    }
    SurveyQuestionBoolean.prototype.getStateElement = function () {
        return this.question;
    };
    Object.defineProperty(SurveyQuestionBoolean.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    /*
    private get allowClick(): boolean {
      return this.question.isIndeterminate && !this.isDisplayMode;
    }
    */
    SurveyQuestionBoolean.prototype.doCheck = function (value) {
        this.question.booleanValue = value;
    };
    SurveyQuestionBoolean.prototype.handleOnChange = function (event) {
        this.doCheck(event.target.checked);
    };
    SurveyQuestionBoolean.prototype.handleOnClick = function (event) {
        this.question.onLabelClick(event, true);
    };
    SurveyQuestionBoolean.prototype.handleOnSwitchClick = function (event) {
        this.question.onSwitchClickModel(event.nativeEvent);
    };
    SurveyQuestionBoolean.prototype.handleOnLabelClick = function (event, value) {
        this.question.onLabelClick(event, value);
    };
    SurveyQuestionBoolean.prototype.handleOnKeyDown = function (event) {
        this.question.onKeyDownCore(event);
    };
    SurveyQuestionBoolean.prototype.updateDomElement = function () {
        if (!this.question)
            return;
        var el = this.checkRef.current;
        if (el) {
            el.indeterminate = this.question.isIndeterminate;
        }
        this.setControl(el);
        _super.prototype.updateDomElement.call(this);
    };
    SurveyQuestionBoolean.prototype.renderElement = function () {
        var _this = this;
        var cssClasses = this.question.cssClasses;
        var itemClass = this.question.getItemCss();
        return (_("div", { className: cssClasses.root, onKeyDown: this.handleOnKeyDown },
            _("label", { className: itemClass, onClick: this.handleOnClick },
                _("input", { ref: this.checkRef, type: "checkbox", name: this.question.name, value: this.question.booleanValue === null
                        ? ""
                        : this.question.booleanValue, id: this.question.inputId, className: cssClasses.control, disabled: this.question.isDisabledAttr, readOnly: this.question.isReadOnlyAttr, checked: this.question.booleanValue || false, onChange: this.handleOnChange, role: this.question.a11y_input_ariaRole, "aria-required": this.question.a11y_input_ariaRequired, "aria-label": this.question.a11y_input_ariaLabel, "aria-labelledby": this.question.a11y_input_ariaLabelledBy, "aria-describedby": this.question.a11y_input_ariaDescribedBy, "aria-invalid": this.question.a11y_input_ariaInvalid, "aria-errormessage": this.question.a11y_input_ariaErrormessage }),
                _("div", { className: cssClasses.sliderGhost, onClick: function (event) { return _this.handleOnLabelClick(event, _this.question.swapOrder); } },
                    _("span", { className: this.question.getLabelCss(this.question.swapOrder) }, this.renderLocString(this.question.locLabelLeft))),
                _("div", { className: cssClasses.switch, onClick: this.handleOnSwitchClick },
                    _("span", { className: cssClasses.slider }, this.question.isDeterminated && cssClasses.sliderText ?
                        _("span", { className: cssClasses.sliderText }, this.renderLocString(this.question.getCheckedLabel()))
                        : null)),
                _("div", { className: cssClasses.sliderGhost, onClick: function (event) { return _this.handleOnLabelClick(event, !_this.question.swapOrder); } },
                    _("span", { className: this.question.getLabelCss(!this.question.swapOrder) }, this.renderLocString(this.question.locLabelRight))))));
    };
    return SurveyQuestionBoolean;
}(reactquestion_element_SurveyQuestionElementBase));

ReactQuestionFactory.Instance.registerQuestion("boolean", function (props) {
    return _(boolean_SurveyQuestionBoolean, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/boolean-checkbox.tsx
var boolean_checkbox_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var boolean_checkbox_SurveyQuestionBooleanCheckbox = /** @class */ (function (_super) {
    boolean_checkbox_extends(SurveyQuestionBooleanCheckbox, _super);
    function SurveyQuestionBooleanCheckbox(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionBooleanCheckbox.prototype.renderElement = function () {
        var cssClasses = this.question.cssClasses;
        var itemClass = this.question.getCheckboxItemCss();
        var description = this.question.canRenderLabelDescription ?
            reactquestion_element_SurveyElementBase.renderQuestionDescription(this.question) : null;
        return (_("div", { className: cssClasses.rootCheckbox },
            _("div", { className: itemClass },
                _("label", { className: cssClasses.checkboxLabel },
                    _("input", { ref: this.checkRef, type: "checkbox", name: this.question.name, value: this.question.booleanValue === null
                            ? ""
                            : this.question.booleanValue, id: this.question.inputId, className: cssClasses.controlCheckbox, disabled: this.question.isDisabledAttr, readOnly: this.question.isReadOnlyAttr, checked: this.question.booleanValue || false, onChange: this.handleOnChange, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage }),
                    _("span", { className: cssClasses.checkboxMaterialDecorator },
                        this.question.svgIcon ?
                            _("svg", { className: cssClasses.checkboxItemDecorator },
                                _("use", { xlinkHref: this.question.svgIcon })) : null,
                        _("span", { className: "check" })),
                    this.question.isLabelRendered && (_("span", { className: cssClasses.checkboxControlLabel, id: this.question.labelRenderedAriaID },
                        _(title_actions_TitleActions, { element: this.question, cssClasses: this.question.cssClasses })))),
                description)));
    };
    return SurveyQuestionBooleanCheckbox;
}(boolean_SurveyQuestionBoolean));

ReactQuestionFactory.Instance.registerQuestion("sv-boolean-checkbox", function (props) {
    return _(boolean_checkbox_SurveyQuestionBooleanCheckbox, props);
});
external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["RendererFactory"].Instance.registerRenderer("boolean", "checkbox", "sv-boolean-checkbox");

// CONCATENATED MODULE: ./packages/survey-react-ui/src/boolean-radio.tsx
var boolean_radio_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var boolean_radio_SurveyQuestionBooleanRadio = /** @class */ (function (_super) {
    boolean_radio_extends(SurveyQuestionBooleanRadio, _super);
    function SurveyQuestionBooleanRadio(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnChange = function (event) {
            _this.question.booleanValue = event.nativeEvent.target.value == "true";
        };
        return _this;
    }
    SurveyQuestionBooleanRadio.prototype.renderRadioItem = function (value, locText) {
        var cssClasses = this.question.cssClasses;
        return (_("div", { role: "presentation", className: this.question.getRadioItemClass(cssClasses, value) },
            _("label", { className: cssClasses.radioLabel },
                _("input", { type: "radio", name: this.question.name, value: value, "aria-errormessage": this.question.ariaErrormessage, checked: value === this.question.booleanValueRendered, disabled: this.question.isDisabledAttr, readOnly: this.question.isReadOnlyAttr, className: cssClasses.itemRadioControl, onChange: this.handleOnChange }),
                this.question.cssClasses.materialRadioDecorator ?
                    (_("span", { className: cssClasses.materialRadioDecorator }, this.question.itemSvgIcon ?
                        (_("svg", { className: cssClasses.itemRadioDecorator },
                            _("use", { xlinkHref: this.question.itemSvgIcon }))) : null)) : null,
                _("span", { className: cssClasses.radioControlLabel }, this.renderLocString(locText)))));
    };
    SurveyQuestionBooleanRadio.prototype.renderElement = function () {
        var cssClasses = this.question.cssClasses;
        return (_("div", { className: cssClasses.rootRadio },
            _("fieldset", { role: "presentation", className: cssClasses.radioFieldset }, !this.question.swapOrder ?
                (_(b, null,
                    this.renderRadioItem(false, this.question.locLabelFalse),
                    this.renderRadioItem(true, this.question.locLabelTrue)))
                :
                    (_(b, null,
                        this.renderRadioItem(true, this.question.locLabelTrue),
                        this.renderRadioItem(false, this.question.locLabelFalse))))));
    };
    return SurveyQuestionBooleanRadio;
}(boolean_SurveyQuestionBoolean));

ReactQuestionFactory.Instance.registerQuestion("sv-boolean-radio", function (props) {
    return _(boolean_radio_SurveyQuestionBooleanRadio, props);
});
external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["RendererFactory"].Instance.registerRenderer("boolean", "radio", "sv-boolean-radio");

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_empty.tsx
var reactquestion_empty_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var reactquestion_empty_SurveyQuestionEmpty = /** @class */ (function (_super) {
    reactquestion_empty_extends(SurveyQuestionEmpty, _super);
    function SurveyQuestionEmpty(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { value: _this.question.value };
        return _this;
    }
    Object.defineProperty(SurveyQuestionEmpty.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionEmpty.prototype.renderElement = function () {
        return _("div", null);
    };
    return SurveyQuestionEmpty;
}(reactquestion_element_SurveyQuestionElementBase));

ReactQuestionFactory.Instance.registerQuestion("empty", function (props) {
    return _(reactquestion_empty_SurveyQuestionEmpty, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/matrix/row.tsx
var matrix_row_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var row_MatrixRow = /** @class */ (function (_super) {
    matrix_row_extends(MatrixRow, _super);
    function MatrixRow(props) {
        var _this = _super.call(this, props) || this;
        _this.root = xn.createRef();
        _this.onPointerDownHandler = function (event) {
            _this.parentMatrix.onPointerDown(event.nativeEvent, _this.model.row);
        };
        return _this;
    }
    Object.defineProperty(MatrixRow.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MatrixRow.prototype, "parentMatrix", {
        get: function () {
            return this.props.parentMatrix;
        },
        enumerable: false,
        configurable: true
    });
    MatrixRow.prototype.getStateElement = function () {
        return this.model;
    };
    MatrixRow.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (this.root.current) {
            this.model.setRootElement(this.root.current);
        }
    };
    MatrixRow.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.model.setRootElement(undefined);
    };
    MatrixRow.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (!_super.prototype.shouldComponentUpdate.call(this, nextProps, nextState))
            return false;
        if (nextProps.model !== this.model) {
            if (nextProps.element) {
                nextProps.element.setRootElement(this.root.current);
            }
            if (this.model) {
                this.model.setRootElement(undefined);
            }
        }
        return true;
    };
    MatrixRow.prototype.render = function () {
        var _this = this;
        var model = this.model;
        if (!model.visible)
            return null;
        return (xn.createElement("tr", { ref: this.root, className: model.className, "data-sv-drop-target-matrix-row": model.row && model.row.id, onPointerDown: function (event) { return _this.onPointerDownHandler(event); } }, this.props.children));
    };
    return MatrixRow;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-matrix-row", function (props) {
    return xn.createElement(row_MatrixRow, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/matrix-actions/drag-drop-icon/drag-drop-icon.tsx
var drag_drop_icon_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var drag_drop_icon_SurveyQuestionMatrixDynamicDragDropIcon = /** @class */ (function (_super) {
    drag_drop_icon_extends(SurveyQuestionMatrixDynamicDragDropIcon, _super);
    function SurveyQuestionMatrixDynamicDragDropIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyQuestionMatrixDynamicDragDropIcon.prototype, "question", {
        get: function () {
            return this.props.item.data.question;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixDynamicDragDropIcon.prototype.renderElement = function () {
        return xn.createElement("div", null, this.renderIcon());
    };
    SurveyQuestionMatrixDynamicDragDropIcon.prototype.renderIcon = function () {
        if (this.question.iconDragElement) {
            return (xn.createElement("svg", { className: this.question.cssClasses.dragElementDecorator },
                xn.createElement("use", { xlinkHref: this.question.iconDragElement })));
        }
        else {
            return (xn.createElement("span", { className: this.question.cssClasses.iconDrag }));
        }
    };
    return SurveyQuestionMatrixDynamicDragDropIcon;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("sv-matrix-drag-drop-icon", function (props) {
    return xn.createElement(drag_drop_icon_SurveyQuestionMatrixDynamicDragDropIcon, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_matrixdropdownbase.tsx
var reactquestion_matrixdropdownbase_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();











var reactquestion_matrixdropdownbase_SurveyQuestionMatrixTable = /** @class */ (function (_super) {
    reactquestion_matrixdropdownbase_extends(SurveyQuestionMatrixTable, _super);
    function SurveyQuestionMatrixTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyQuestionMatrixTable.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixTable.prototype, "creator", {
        get: function () {
            return this.props.creator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixTable.prototype, "table", {
        get: function () {
            return this.question.renderedTable;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixTable.prototype.getStateElement = function () {
        return this.table;
    };
    SurveyQuestionMatrixTable.prototype.wrapCell = function (cell, element, reason) {
        return this.props.wrapCell(cell, element, reason);
    };
    SurveyQuestionMatrixTable.prototype.renderHeader = function () {
        var table = this.question.renderedTable;
        if (!table.showHeader)
            return null;
        var headers = [];
        var cells = table.headerRow.cells;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var key = "column" + i;
            var columnStyle = {};
            if (!!cell.width) {
                columnStyle.width = cell.width;
            }
            if (!!cell.minWidth) {
                columnStyle.minWidth = cell.minWidth;
            }
            var cellContent = this.renderCellContent(cell, "column-header", {});
            var header = cell.hasTitle ?
                _("th", { className: cell.className, key: key, style: columnStyle },
                    " ",
                    cellContent,
                    " ")
                : _("td", { className: cell.className, key: key, style: columnStyle });
            headers.push(header);
        }
        return (_("thead", null,
            _("tr", null, headers)));
    };
    SurveyQuestionMatrixTable.prototype.renderFooter = function () {
        var table = this.question.renderedTable;
        if (!table.showFooter)
            return null;
        var row = this.renderRow("footer", table.footerRow, this.question.cssClasses, "row-footer");
        return _("tfoot", null, row);
    };
    SurveyQuestionMatrixTable.prototype.renderRows = function () {
        var cssClasses = this.question.cssClasses;
        var rows = [];
        var renderedRows = this.question.renderedTable.renderedRows;
        for (var i = 0; i < renderedRows.length; i++) {
            rows.push(this.renderRow(renderedRows[i].id, renderedRows[i], cssClasses));
        }
        return _("tbody", null, rows);
    };
    SurveyQuestionMatrixTable.prototype.renderRow = function (keyValue, row, cssClasses, reason) {
        var matrixrow = [];
        var cells = row.cells;
        for (var i = 0; i < cells.length; i++) {
            matrixrow.push(this.renderCell(cells[i], i, cssClasses, reason));
        }
        var key = "row" + keyValue;
        return (_(b, { key: key }, (reason == "row-footer") ? _("tr", null, matrixrow) : _(row_MatrixRow, { model: row, parentMatrix: this.question }, matrixrow)));
    };
    SurveyQuestionMatrixTable.prototype.renderCell = function (cell, index, cssClasses, reason) {
        var key = "cell" + index;
        if (cell.hasQuestion) {
            return (_(reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownCell, { key: key, cssClasses: cssClasses, cell: cell, creator: this.creator, reason: reason }));
        }
        if (cell.isErrorsCell) {
            if (cell.isErrorsCell) {
                return (_(reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownErrorsCell, { cell: cell, key: key, keyValue: key, question: cell.question, creator: this.creator }));
            }
        }
        var calcReason = reason;
        if (!calcReason) {
            calcReason = cell.hasTitle ? "row-header" : "";
        }
        var cellContent = this.renderCellContent(cell, calcReason, cssClasses);
        var cellStyle = null;
        if (!!cell.width || !!cell.minWidth) {
            cellStyle = {};
            if (!!cell.width)
                cellStyle.width = cell.width;
            if (!!cell.minWidth)
                cellStyle.minWidth = cell.minWidth;
        }
        return (_("td", { className: cell.className, key: key, style: cellStyle, colSpan: cell.colSpans, title: cell.getTitle() }, cellContent));
    };
    SurveyQuestionMatrixTable.prototype.renderCellContent = function (cell, reason, cssClasses) {
        var cellContent = null;
        var cellStyle = null;
        if (!!cell.width || !!cell.minWidth) {
            cellStyle = {};
            if (!!cell.width)
                cellStyle.width = cell.width;
            if (!!cell.minWidth)
                cellStyle.minWidth = cell.minWidth;
        }
        if (cell.hasTitle) {
            reason = "row-header";
            var str = this.renderLocString(cell.locTitle);
            var require_1 = !!cell.column ? _(reactquestion_matrixdropdownbase_SurveyQuestionMatrixHeaderRequired, { column: cell.column, question: this.question }) : null;
            cellContent = (_(b, null,
                str,
                require_1));
        }
        if (cell.isDragHandlerCell) {
            cellContent = (_(b, null,
                _(drag_drop_icon_SurveyQuestionMatrixDynamicDragDropIcon, { item: { data: { row: cell.row, question: this.question } } })));
        }
        if (cell.isActionsCell) {
            cellContent = (ReactElementFactory.Instance.createElement("sv-matrixdynamic-actions-cell", {
                question: this.question,
                cssClasses: cssClasses, cell: cell,
                model: cell.item.getData()
            }));
        }
        if (cell.hasPanel) {
            cellContent = (_(panel_SurveyPanel, { key: cell.panel.id, element: cell.panel, survey: this.question.survey, cssClasses: cssClasses, isDisplayMode: this.isDisplayMode, creator: this.creator }));
        }
        if (!cellContent)
            return null;
        var readyCell = (_(b, null, cellContent));
        return this.wrapCell(cell, readyCell, reason);
    };
    SurveyQuestionMatrixTable.prototype.renderElement = function () {
        var header = this.renderHeader();
        var footers = this.renderFooter();
        var rows = this.renderRows();
        return (_("table", { className: this.question.getTableCss() },
            header,
            rows,
            footers));
    };
    return SurveyQuestionMatrixTable;
}(reactquestion_element_SurveyElementBase));
var reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownBase = /** @class */ (function (_super) {
    reactquestion_matrixdropdownbase_extends(SurveyQuestionMatrixDropdownBase, _super);
    function SurveyQuestionMatrixDropdownBase(props) {
        var _this = _super.call(this, props) || this;
        //Create rendered table in contructor and not on rendering
        var table = _this.question.renderedTable;
        _this.state = _this.getState();
        return _this;
    }
    Object.defineProperty(SurveyQuestionMatrixDropdownBase.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixDropdownBase.prototype.getState = function (prevState) {
        if (prevState === void 0) { prevState = null; }
        return { rowCounter: !prevState ? 0 : prevState.rowCounter + 1 };
    };
    SurveyQuestionMatrixDropdownBase.prototype.updateStateOnCallback = function () {
        if (this.isRendering)
            return;
        this.setState(this.getState(this.state));
    };
    SurveyQuestionMatrixDropdownBase.prototype.componentDidMount = function () {
        var _this = this;
        _super.prototype.componentDidMount.call(this);
        this.question.onRenderedTableResetCallback = function () {
            _this.updateStateOnCallback();
        };
    };
    SurveyQuestionMatrixDropdownBase.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.question.onRenderedTableResetCallback = function () { };
    };
    SurveyQuestionMatrixDropdownBase.prototype.renderElement = function () {
        return this.renderTableDiv();
    };
    SurveyQuestionMatrixDropdownBase.prototype.renderTableDiv = function () {
        var _this = this;
        var divStyle = this.question.showHorizontalScroll
            ? { overflowX: "scroll" }
            : {};
        return (_("div", { style: divStyle, className: this.question.cssClasses.tableWrapper, ref: function (root) { return (_this.setControl(root)); } },
            _(reactquestion_matrixdropdownbase_SurveyQuestionMatrixTable, { question: this.question, creator: this.creator, wrapCell: function (cell, element, reason) { return _this.wrapCell(cell, element, reason); } })));
    };
    return SurveyQuestionMatrixDropdownBase;
}(reactquestion_element_SurveyQuestionElementBase));

var reactquestion_matrixdropdownbase_SurveyQuestionMatrixActionsCell = /** @class */ (function (_super) {
    reactquestion_matrixdropdownbase_extends(SurveyQuestionMatrixActionsCell, _super);
    function SurveyQuestionMatrixActionsCell(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionMatrixActionsCell.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixActionsCell.prototype.renderElement = function () {
        return (_(action_bar_SurveyActionBar, { model: this.model, handleClick: false }));
    };
    return SurveyQuestionMatrixActionsCell;
}(ReactSurveyElement));
var reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownErrorsCell = /** @class */ (function (_super) {
    reactquestion_matrixdropdownbase_extends(SurveyQuestionMatrixDropdownErrorsCell, _super);
    function SurveyQuestionMatrixDropdownErrorsCell(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionMatrixDropdownErrorsCell.prototype, "key", {
        get: function () {
            return this.props.keyValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixDropdownErrorsCell.prototype, "cell", {
        get: function () {
            return this.props.cell;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixDropdownErrorsCell.prototype.render = function () {
        if (!this.cell.isVisible)
            return null;
        return _("td", { className: this.cell.className, key: this.key, colSpan: this.cell.colSpans, title: this.cell.getTitle() }, _super.prototype.render.call(this));
    };
    SurveyQuestionMatrixDropdownErrorsCell.prototype.getQuestionPropertiesToTrack = function () {
        return _super.prototype.getQuestionPropertiesToTrack.call(this).concat(["visible"]);
    };
    return SurveyQuestionMatrixDropdownErrorsCell;
}(reactquestion_SurveyQuestionErrorCell));
ReactElementFactory.Instance.registerElement("sv-matrixdynamic-actions-cell", function (props) {
    return _(reactquestion_matrixdropdownbase_SurveyQuestionMatrixActionsCell, props);
});
var reactquestion_matrixdropdownbase_SurveyQuestionMatrixHeaderRequired = /** @class */ (function (_super) {
    reactquestion_matrixdropdownbase_extends(SurveyQuestionMatrixHeaderRequired, _super);
    function SurveyQuestionMatrixHeaderRequired(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionMatrixHeaderRequired.prototype, "column", {
        get: function () {
            return this.props.column;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixHeaderRequired.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixHeaderRequired.prototype.getStateElement = function () {
        return this.column;
    };
    SurveyQuestionMatrixHeaderRequired.prototype.renderElement = function () {
        if (!this.column.isRenderedRequired)
            return null;
        return (_(b, null,
            _("span", null, "\u00A0"),
            _("span", { className: this.question.cssClasses.cellRequiredText }, this.column.requiredText)));
    };
    return SurveyQuestionMatrixHeaderRequired;
}(ReactSurveyElement));
var reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownCell = /** @class */ (function (_super) {
    reactquestion_matrixdropdownbase_extends(SurveyQuestionMatrixDropdownCell, _super);
    function SurveyQuestionMatrixDropdownCell(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionMatrixDropdownCell.prototype, "cell", {
        get: function () {
            return this.props.cell;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixDropdownCell.prototype, "itemCss", {
        get: function () {
            return !!this.cell ? this.cell.className : "";
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixDropdownCell.prototype.getQuestion = function () {
        var q = _super.prototype.getQuestion.call(this);
        if (!!q)
            return q;
        return !!this.cell ? this.cell.question : null;
    };
    SurveyQuestionMatrixDropdownCell.prototype.doAfterRender = function () {
        var el = this.cellRef.current;
        if (el &&
            this.cell &&
            this.question &&
            this.question.survey &&
            el.getAttribute("data-rendered") !== "r") {
            el.setAttribute("data-rendered", "r");
            var options = {
                cell: this.cell,
                cellQuestion: this.question,
                htmlElement: el,
                row: this.cell.row,
                column: this.cell.cell.column,
            };
            this.question.survey.matrixAfterCellRender(this.question, options);
            this.question.afterRenderCore(el);
        }
    };
    SurveyQuestionMatrixDropdownCell.prototype.getShowErrors = function () {
        return (this.question.isVisible &&
            (!this.cell.isChoice || this.cell.isFirstChoice));
    };
    SurveyQuestionMatrixDropdownCell.prototype.getCellStyle = function () {
        var res = _super.prototype.getCellStyle.call(this);
        if (!!this.cell.width || !!this.cell.minWidth) {
            if (!res)
                res = {};
            if (!!this.cell.width)
                res.width = this.cell.width;
            if (!!this.cell.minWidth)
                res.minWidth = this.cell.minWidth;
        }
        return res;
    };
    SurveyQuestionMatrixDropdownCell.prototype.getHeaderText = function () {
        return this.cell.headers;
    };
    SurveyQuestionMatrixDropdownCell.prototype.renderElement = function () {
        if (!this.cell.isVisible) {
            return null;
        }
        return _super.prototype.renderElement.call(this);
    };
    SurveyQuestionMatrixDropdownCell.prototype.renderCellContent = function () {
        var content = _super.prototype.renderCellContent.call(this);
        var responsiveTitle = this.cell.showResponsiveTitle ? (_("span", { className: this.cell.responsiveTitleCss }, this.renderLocString(this.cell.responsiveLocTitle))) : null;
        return _(b, null,
            responsiveTitle,
            content);
    };
    SurveyQuestionMatrixDropdownCell.prototype.renderQuestion = function () {
        if (!this.question.isVisible)
            return _(b, null);
        if (!this.cell.isChoice)
            return reactquestion_SurveyQuestion.renderQuestionBody(this.creator, this.question);
        if (this.cell.isOtherChoice)
            return this.renderOtherComment();
        if (this.cell.isCheckbox)
            return this.renderCellCheckboxButton();
        return this.renderCellRadiogroupButton();
    };
    SurveyQuestionMatrixDropdownCell.prototype.renderOtherComment = function () {
        var question = this.cell.question;
        var cssClasses = question.cssClasses || {};
        return _(SurveyQuestionOtherValueItem, { question: question, cssClasses: cssClasses, otherCss: cssClasses.other, isDisplayMode: question.isInputReadOnly });
    };
    SurveyQuestionMatrixDropdownCell.prototype.renderCellCheckboxButton = function () {
        var key = this.cell.question.id + "item" + this.cell.choiceIndex;
        return (_(reactquestion_checkbox_SurveyQuestionCheckboxItem, { key: key, question: this.cell.question, cssClasses: this.cell.question.cssClasses, isDisplayMode: this.cell.question.isInputReadOnly, item: this.cell.item, isFirst: this.cell.isFirstChoice, index: this.cell.choiceIndex.toString(), hideCaption: true }));
    };
    SurveyQuestionMatrixDropdownCell.prototype.renderCellRadiogroupButton = function () {
        var key = this.cell.question.id + "item" + this.cell.choiceIndex;
        return (_(reactquestion_radiogroup_SurveyQuestionRadioItem, { key: key, question: this.cell.question, cssClasses: this.cell.question.cssClasses, isDisplayMode: this.cell.question.isInputReadOnly, item: this.cell.item, index: this.cell.choiceIndex.toString(), isChecked: this.cell.question.value === this.cell.item.value, isDisabled: this.cell.question.isReadOnly || !this.cell.item.isEnabled, hideCaption: true }));
    };
    return SurveyQuestionMatrixDropdownCell;
}(reactquestion_SurveyQuestionAndErrorsCell));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_matrixdropdown.tsx
var reactquestion_matrixdropdown_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var SurveyQuestionMatrixDropdown = /** @class */ (function (_super) {
    reactquestion_matrixdropdown_extends(SurveyQuestionMatrixDropdown, _super);
    function SurveyQuestionMatrixDropdown(props) {
        return _super.call(this, props) || this;
    }
    return SurveyQuestionMatrixDropdown;
}(reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownBase));

ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", function (props) {
    return _(SurveyQuestionMatrixDropdown, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_matrixdynamic.tsx
var reactquestion_matrixdynamic_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var reactquestion_matrixdynamic_SurveyQuestionMatrixDynamic = /** @class */ (function (_super) {
    reactquestion_matrixdynamic_extends(SurveyQuestionMatrixDynamic, _super);
    function SurveyQuestionMatrixDynamic(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnRowAddClick = _this.handleOnRowAddClick.bind(_this);
        return _this;
    }
    Object.defineProperty(SurveyQuestionMatrixDynamic.prototype, "matrix", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixDynamic.prototype.handleOnRowAddClick = function (event) {
        this.matrix.addRowUI();
    };
    SurveyQuestionMatrixDynamic.prototype.renderElement = function () {
        var cssClasses = this.question.cssClasses;
        var showTable = this.question.renderedTable.showTable;
        var mainDiv = showTable
            ? this.renderTableDiv()
            : this.renderNoRowsContent(cssClasses);
        return (_("div", null,
            this.renderAddRowButtonOnTop(cssClasses),
            mainDiv,
            this.renderAddRowButtonOnBottom(cssClasses)));
    };
    SurveyQuestionMatrixDynamic.prototype.renderAddRowButtonOnTop = function (cssClasses) {
        if (!this.matrix.renderedTable.showAddRowOnTop)
            return null;
        return this.renderAddRowButton(cssClasses);
    };
    SurveyQuestionMatrixDynamic.prototype.renderAddRowButtonOnBottom = function (cssClasses) {
        if (!this.matrix.renderedTable.showAddRowOnBottom)
            return null;
        return this.renderAddRowButton(cssClasses);
    };
    SurveyQuestionMatrixDynamic.prototype.renderNoRowsContent = function (cssClasses) {
        var text = this.renderLocString(this.matrix.locEmptyRowsText);
        var textDiv = _("div", { className: cssClasses.emptyRowsText }, text);
        var btn = this.matrix.renderedTable.showAddRow ? this.renderAddRowButton(cssClasses, true) : undefined;
        return (_("div", { className: cssClasses.emptyRowsSection },
            textDiv,
            btn));
    };
    SurveyQuestionMatrixDynamic.prototype.renderAddRowButton = function (cssClasses, isEmptySection) {
        if (isEmptySection === void 0) { isEmptySection = false; }
        return ReactElementFactory.Instance.createElement("sv-matrixdynamic-add-btn", {
            question: this.question,
            cssClasses: cssClasses, isEmptySection: isEmptySection
        });
    };
    return SurveyQuestionMatrixDynamic;
}(reactquestion_matrixdropdownbase_SurveyQuestionMatrixDropdownBase));

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", function (props) {
    return _(reactquestion_matrixdynamic_SurveyQuestionMatrixDynamic, props);
});
var reactquestion_matrixdynamic_SurveyQuestionMatrixDynamicAddButton = /** @class */ (function (_super) {
    reactquestion_matrixdynamic_extends(SurveyQuestionMatrixDynamicAddButton, _super);
    function SurveyQuestionMatrixDynamicAddButton(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnRowAddClick = _this.handleOnRowAddClick.bind(_this);
        return _this;
    }
    Object.defineProperty(SurveyQuestionMatrixDynamicAddButton.prototype, "matrix", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixDynamicAddButton.prototype.handleOnRowAddClick = function (event) {
        this.matrix.addRowUI();
    };
    SurveyQuestionMatrixDynamicAddButton.prototype.renderElement = function () {
        var addRowText = this.renderLocString(this.matrix.locAddRowText);
        var addButton = (_("button", { className: this.matrix.getAddRowButtonCss(this.props.isEmptySection), type: "button", disabled: this.matrix.isInputReadOnly, onClick: this.matrix.isDesignMode ? undefined : this.handleOnRowAddClick },
            addRowText,
            _("span", { className: this.props.cssClasses.iconAdd })));
        return (this.props.isEmptySection ? addButton : _("div", { className: this.props.cssClasses.footer }, addButton));
    };
    return SurveyQuestionMatrixDynamicAddButton;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("sv-matrixdynamic-add-btn", function (props) {
    return _(reactquestion_matrixdynamic_SurveyQuestionMatrixDynamicAddButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/paneldynamic-actions/paneldynamic-add-btn.tsx
var paneldynamic_add_btn_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var SurveyQuestionPanelDynamicAction = /** @class */ (function (_super) {
    paneldynamic_add_btn_extends(SurveyQuestionPanelDynamicAction, _super);
    function SurveyQuestionPanelDynamicAction(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionPanelDynamicAction.prototype, "data", {
        get: function () {
            return (this.props.item && this.props.item.data) || this.props.data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionPanelDynamicAction.prototype, "question", {
        get: function () {
            return (this.props.item && this.props.item.data.question) || this.props.data.question;
        },
        enumerable: false,
        configurable: true
    });
    return SurveyQuestionPanelDynamicAction;
}(ReactSurveyElement));

var paneldynamic_add_btn_SurveyQuestionPanelDynamicAddButton = /** @class */ (function (_super) {
    paneldynamic_add_btn_extends(SurveyQuestionPanelDynamicAddButton, _super);
    function SurveyQuestionPanelDynamicAddButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (event) {
            _this.question.addPanelUI();
        };
        return _this;
    }
    SurveyQuestionPanelDynamicAddButton.prototype.renderElement = function () {
        if (!this.question.canAddPanel)
            return null;
        var btnText = this.renderLocString(this.question.locPanelAddText);
        return (xn.createElement("button", { type: "button", id: this.question.addButtonId, className: this.question.getAddButtonCss(), onClick: this.handleClick },
            xn.createElement("span", { className: this.question.cssClasses.buttonAddText }, btnText)));
    };
    return SurveyQuestionPanelDynamicAddButton;
}(SurveyQuestionPanelDynamicAction));

ReactElementFactory.Instance.registerElement("sv-paneldynamic-add-btn", function (props) {
    return xn.createElement(paneldynamic_add_btn_SurveyQuestionPanelDynamicAddButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/paneldynamic-actions/paneldynamic-next-btn.tsx
var paneldynamic_next_btn_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var paneldynamic_next_btn_SurveyQuestionPanelDynamicNextButton = /** @class */ (function (_super) {
    paneldynamic_next_btn_extends(SurveyQuestionPanelDynamicNextButton, _super);
    function SurveyQuestionPanelDynamicNextButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (event) {
            _this.question.goToNextPanel();
        };
        return _this;
    }
    SurveyQuestionPanelDynamicNextButton.prototype.renderElement = function () {
        return (xn.createElement("div", { title: this.question.panelNextText, onClick: this.handleClick, className: this.question.getNextButtonCss() },
            xn.createElement(svg_icon_SvgIcon, { iconName: this.question.cssClasses.progressBtnIcon, size: "auto" })));
    };
    return SurveyQuestionPanelDynamicNextButton;
}(SurveyQuestionPanelDynamicAction));

ReactElementFactory.Instance.registerElement("sv-paneldynamic-next-btn", function (props) {
    return xn.createElement(paneldynamic_next_btn_SurveyQuestionPanelDynamicNextButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/paneldynamic-actions/paneldynamic-prev-btn.tsx
var paneldynamic_prev_btn_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var paneldynamic_prev_btn_SurveyQuestionPanelDynamicPrevButton = /** @class */ (function (_super) {
    paneldynamic_prev_btn_extends(SurveyQuestionPanelDynamicPrevButton, _super);
    function SurveyQuestionPanelDynamicPrevButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (event) {
            _this.question.goToPrevPanel();
        };
        return _this;
    }
    SurveyQuestionPanelDynamicPrevButton.prototype.renderElement = function () {
        return (xn.createElement("div", { title: this.question.panelPrevText, onClick: this.handleClick, className: this.question.getPrevButtonCss() },
            xn.createElement(svg_icon_SvgIcon, { iconName: this.question.cssClasses.progressBtnIcon, size: "auto" })));
    };
    return SurveyQuestionPanelDynamicPrevButton;
}(SurveyQuestionPanelDynamicAction));

ReactElementFactory.Instance.registerElement("sv-paneldynamic-prev-btn", function (props) {
    return xn.createElement(paneldynamic_prev_btn_SurveyQuestionPanelDynamicPrevButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/paneldynamic-actions/paneldynamic-progress-text.tsx
var paneldynamic_progress_text_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var paneldynamic_progress_text_SurveyQuestionPanelDynamicProgressText = /** @class */ (function (_super) {
    paneldynamic_progress_text_extends(SurveyQuestionPanelDynamicProgressText, _super);
    function SurveyQuestionPanelDynamicProgressText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SurveyQuestionPanelDynamicProgressText.prototype.renderElement = function () {
        return (xn.createElement("div", { className: this.question.cssClasses.progressText }, this.question.progressText));
    };
    return SurveyQuestionPanelDynamicProgressText;
}(SurveyQuestionPanelDynamicAction));

ReactElementFactory.Instance.registerElement("sv-paneldynamic-progress-text", function (props) {
    return xn.createElement(paneldynamic_progress_text_SurveyQuestionPanelDynamicProgressText, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_paneldynamic.tsx
var reactquestion_paneldynamic_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();









var reactquestion_paneldynamic_SurveyQuestionPanelDynamic = /** @class */ (function (_super) {
    reactquestion_paneldynamic_extends(SurveyQuestionPanelDynamic, _super);
    function SurveyQuestionPanelDynamic(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionPanelDynamic.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionPanelDynamic.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.setState({ panelCounter: 0 });
        var self = this;
        this.question.panelCountChangedCallback = function () {
            self.updateQuestionRendering();
        };
        this.question.currentIndexChangedCallback = function () {
            self.updateQuestionRendering();
        };
        this.question.renderModeChangedCallback = function () {
            self.updateQuestionRendering();
        };
    };
    SurveyQuestionPanelDynamic.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.question.panelCountChangedCallback = function () { };
        this.question.currentIndexChangedCallback = function () { };
        this.question.renderModeChangedCallback = function () { };
    };
    SurveyQuestionPanelDynamic.prototype.updateQuestionRendering = function () {
        this.setState({
            panelCounter: this.state ? this.state.panelCounter + 1 : 1,
        });
    };
    SurveyQuestionPanelDynamic.prototype.renderElement = function () {
        var _this = this;
        var panels = [];
        this.question.renderedPanels.forEach(function (panel, index) {
            panels.push(_(reactquestion_paneldynamic_SurveyQuestionPanelDynamicItem, { key: panel.id, element: panel, question: _this.question, index: index, cssClasses: _this.question.cssClasses, isDisplayMode: _this.isDisplayMode, creator: _this.creator }));
        });
        var btnAdd = this.question.isRenderModeList && this.question["showLegacyNavigation"]
            ? this.renderAddRowButton()
            : null;
        var navTop = this.question.isProgressTopShowing
            ? this.renderNavigator()
            : null;
        var navBottom = this.question.isProgressBottomShowing
            ? this.renderNavigator()
            : null;
        var navV2 = this.renderNavigatorV2();
        var noEntriesPlaceholder = this.renderPlaceholder();
        return (_("div", { className: this.question.cssClasses.root },
            noEntriesPlaceholder,
            navTop,
            _("div", { className: this.question.cssClasses.panelsContainer }, panels),
            navBottom,
            btnAdd,
            navV2));
    };
    SurveyQuestionPanelDynamic.prototype.renderNavigator = function () {
        if (!this.question["showLegacyNavigation"]) {
            if (this.question.isRangeShowing && this.question.isProgressTopShowing) {
                return this.renderRange();
            }
            else {
                return null;
            }
        }
        var range = this.question.isRangeShowing ? this.renderRange() : null;
        var btnPrev = this.rendrerPrevButton();
        var btnNext = this.rendrerNextButton();
        var btnAdd = this.renderAddRowButton();
        var progressClass = this.question.isProgressTopShowing
            ? this.question.cssClasses.progressTop
            : this.question.cssClasses.progressBottom;
        return (_("div", { className: progressClass },
            _("div", { style: { clear: "both" } },
                _("div", { className: this.question.cssClasses.progressContainer },
                    btnPrev,
                    range,
                    btnNext),
                btnAdd,
                this.renderProgressText())));
    };
    SurveyQuestionPanelDynamic.prototype.renderProgressText = function () {
        return (_(paneldynamic_progress_text_SurveyQuestionPanelDynamicProgressText, { data: { question: this.question } }));
    };
    SurveyQuestionPanelDynamic.prototype.rendrerPrevButton = function () {
        return (_(paneldynamic_prev_btn_SurveyQuestionPanelDynamicPrevButton, { data: { question: this.question } }));
    };
    SurveyQuestionPanelDynamic.prototype.rendrerNextButton = function () {
        return (_(paneldynamic_next_btn_SurveyQuestionPanelDynamicNextButton, { data: { question: this.question } }));
    };
    SurveyQuestionPanelDynamic.prototype.renderRange = function () {
        return (_("div", { className: this.question.cssClasses.progress },
            _("div", { className: this.question.cssClasses.progressBar, style: { width: this.question.progress }, role: "progressbar" })));
    };
    SurveyQuestionPanelDynamic.prototype.renderAddRowButton = function () {
        return ReactElementFactory.Instance.createElement("sv-paneldynamic-add-btn", {
            data: { question: this.question }
        });
    };
    SurveyQuestionPanelDynamic.prototype.renderNavigatorV2 = function () {
        if (!this.question.showNavigation)
            return null;
        var range = this.question.isRangeShowing && this.question.isProgressBottomShowing ? this.renderRange() : null;
        return (_("div", { className: this.question.cssClasses.footer },
            _("hr", { className: this.question.cssClasses.separator }),
            range,
            this.question.footerToolbar.visibleActions.length ? (_("div", { className: this.question.cssClasses.footerButtonsContainer },
                _(action_bar_SurveyActionBar, { model: this.question.footerToolbar }))) : null));
    };
    SurveyQuestionPanelDynamic.prototype.renderPlaceholder = function () {
        if (this.question.getShowNoEntriesPlaceholder()) {
            return (_("div", { className: this.question.cssClasses.noEntriesPlaceholder },
                _("span", null, this.renderLocString(this.question.locNoEntriesText)),
                this.renderAddRowButton()));
        }
        return null;
    };
    return SurveyQuestionPanelDynamic;
}(reactquestion_element_SurveyQuestionElementBase));

var reactquestion_paneldynamic_SurveyQuestionPanelDynamicItem = /** @class */ (function (_super) {
    reactquestion_paneldynamic_extends(SurveyQuestionPanelDynamicItem, _super);
    function SurveyQuestionPanelDynamicItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyQuestionPanelDynamicItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionPanelDynamicItem.prototype, "index", {
        get: function () {
            return this.props.index;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionPanelDynamicItem.prototype.getSurvey = function () {
        return !!this.question ? this.question.survey : null;
    };
    SurveyQuestionPanelDynamicItem.prototype.getCss = function () {
        var survey = this.getSurvey();
        return !!survey ? survey.getCss() : {};
    };
    SurveyQuestionPanelDynamicItem.prototype.render = function () {
        var panel = _super.prototype.render.call(this);
        var removeButton = this.renderButton();
        var separator = this.question.showSeparator(this.index) ?
            (_("hr", { className: this.question.cssClasses.separator })) : null;
        return (_(b, null,
            _("div", { className: this.question.getPanelWrapperCss(this.panel) },
                panel,
                removeButton),
            separator));
    };
    SurveyQuestionPanelDynamicItem.prototype.renderButton = function () {
        if (this.question.panelRemoveButtonLocation !== "right" ||
            !this.question.canRemovePanel ||
            (this.question.isRenderModeList && this.panel.isCollapsed)) {
            return null;
        }
        return ReactElementFactory.Instance.createElement("sv-paneldynamic-remove-btn", {
            data: { question: this.question, panel: this.panel }
        });
    };
    return SurveyQuestionPanelDynamicItem;
}(panel_SurveyPanel));

ReactQuestionFactory.Instance.registerQuestion("paneldynamic", function (props) {
    return _(reactquestion_paneldynamic_SurveyQuestionPanelDynamic, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/progress.tsx
var progress_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var progress_SurveyProgress = /** @class */ (function (_super) {
    progress_extends(SurveyProgress, _super);
    function SurveyProgress(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyProgress.prototype, "isTop", {
        get: function () {
            return this.props.isTop;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyProgress.prototype, "progress", {
        get: function () {
            return this.survey.progressValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyProgress.prototype, "progressText", {
        get: function () {
            return this.survey.progressText;
        },
        enumerable: false,
        configurable: true
    });
    SurveyProgress.prototype.render = function () {
        var progressStyle = {
            width: this.progress + "%",
        };
        return (_("div", { className: this.survey.getProgressCssClasses(this.props.container) },
            _("div", { style: progressStyle, className: this.css.progressBar, role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": "progress" },
                _("span", { className: external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyProgressModel"].getProgressTextInBarCss(this.css) }, this.progressText)),
            _("span", { className: external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyProgressModel"].getProgressTextUnderBarCss(this.css) }, this.progressText)));
    };
    return SurveyProgress;
}(SurveyNavigationBase));

ReactElementFactory.Instance.registerElement("sv-progress-pages", function (props) {
    return _(progress_SurveyProgress, props);
});
ReactElementFactory.Instance.registerElement("sv-progress-questions", function (props) {
    return _(progress_SurveyProgress, props);
});
ReactElementFactory.Instance.registerElement("sv-progress-correctquestions", function (props) {
    return _(progress_SurveyProgress, props);
});
ReactElementFactory.Instance.registerElement("sv-progress-requiredquestions", function (props) {
    return _(progress_SurveyProgress, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/progressButtons.tsx
var progressButtons_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var progressButtons_SurveyProgressButtons = /** @class */ (function (_super) {
    progressButtons_extends(SurveyProgressButtons, _super);
    function SurveyProgressButtons(props) {
        var _this = _super.call(this, props) || this;
        _this.listContainerRef = m();
        return _this;
    }
    Object.defineProperty(SurveyProgressButtons.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyProgressButtons.prototype, "container", {
        get: function () {
            return this.props.container;
        },
        enumerable: false,
        configurable: true
    });
    SurveyProgressButtons.prototype.onResize = function (canShowItemTitles) {
        this.setState({ canShowItemTitles: canShowItemTitles });
        this.setState({ canShowHeader: !canShowItemTitles });
    };
    SurveyProgressButtons.prototype.onUpdateScroller = function (hasScroller) {
        this.setState({ hasScroller: hasScroller });
    };
    SurveyProgressButtons.prototype.onUpdateSettings = function () {
        this.setState({ canShowItemTitles: this.model.showItemTitles });
        this.setState({ canShowFooter: !this.model.showItemTitles });
    };
    SurveyProgressButtons.prototype.render = function () {
        var _this = this;
        return (_("div", { className: this.model.getRootCss(this.props.container), style: { "maxWidth": this.model.progressWidth }, role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": "progress" },
            this.state.canShowHeader ? _("div", { className: this.css.progressButtonsHeader },
                _("div", { className: this.css.progressButtonsPageTitle, title: this.model.headerText }, this.model.headerText)) : null,
            _("div", { className: this.css.progressButtonsContainer },
                _("div", { className: this.model.getScrollButtonCss(this.state.hasScroller, true), role: "button", onClick: function () {
                        return _this.clickScrollButton(_this.listContainerRef.current, true);
                    } }),
                _("div", { className: this.css.progressButtonsListContainer, ref: this.listContainerRef },
                    _("ul", { className: this.css.progressButtonsList }, this.getListElements())),
                _("div", { className: this.model.getScrollButtonCss(this.state.hasScroller, false), role: "button", onClick: function () {
                        return _this.clickScrollButton(_this.listContainerRef.current, false);
                    } })),
            this.state.canShowFooter ? _("div", { className: this.css.progressButtonsFooter },
                _("div", { className: this.css.progressButtonsPageTitle, title: this.model.footerText }, this.model.footerText)) : null));
    };
    SurveyProgressButtons.prototype.getListElements = function () {
        var _this = this;
        var buttons = [];
        this.survey.visiblePages.forEach(function (page, index) {
            buttons.push(_this.renderListElement(page, index));
        });
        return buttons;
    };
    SurveyProgressButtons.prototype.renderListElement = function (page, index) {
        var _this = this;
        var text = reactquestion_element_SurveyElementBase.renderLocString(page.locNavigationTitle);
        return (_("li", { key: "listelement" + index, className: this.model.getListElementCss(index), onClick: this.model.isListElementClickable(index)
                ? function () { return _this.model.clickListElement(page); }
                : undefined, "data-page-number": this.model.getItemNumber(page) },
            _("div", { className: this.css.progressButtonsConnector }),
            this.state.canShowItemTitles ? _(b, null,
                _("div", { className: this.css.progressButtonsPageTitle, title: page.renderedNavigationTitle }, text),
                _("div", { className: this.css.progressButtonsPageDescription, title: page.navigationDescription }, page.navigationDescription)) : null,
            _("div", { className: this.css.progressButtonsButton },
                _("div", { className: this.css.progressButtonsButtonBackground }),
                _("div", { className: this.css.progressButtonsButtonContent }),
                _("span", null, this.model.getItemNumber(page)))));
    };
    SurveyProgressButtons.prototype.clickScrollButton = function (listContainerElement, isLeftScroll) {
        if (!!listContainerElement) {
            listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
        }
    };
    SurveyProgressButtons.prototype.componentDidMount = function () {
        var _this = this;
        _super.prototype.componentDidMount.call(this);
        setTimeout(function () {
            _this.respManager = new external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["ProgressButtonsResponsivityManager"](_this.model, _this.listContainerRef.current, _this);
        }, 10);
    };
    SurveyProgressButtons.prototype.componentWillUnmount = function () {
        if (!!this.respManager) {
            this.respManager.dispose();
        }
        _super.prototype.componentWillUnmount.call(this);
    };
    return SurveyProgressButtons;
}(SurveyNavigationBase));

ReactElementFactory.Instance.registerElement("sv-progress-buttons", function (props) {
    return _(progressButtons_SurveyProgressButtons, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/list/list-item.tsx
var list_item_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var list_item_ListItem = /** @class */ (function (_super) {
    list_item_extends(ListItem, _super);
    function ListItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleKeydown = function (event) {
            _this.model.onKeyDown(event);
        };
        return _this;
    }
    Object.defineProperty(ListItem.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ListItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    ListItem.prototype.getStateElement = function () {
        return this.item;
    };
    ListItem.prototype.render = function () {
        var _this = this;
        if (!this.item)
            return null;
        var contentWrapStyle = {
            paddingInlineStart: this.model.getItemIndent(this.item)
        };
        var className = this.model.getItemClass(this.item);
        var itemContent = this.item.component || this.model.itemComponent;
        var newElement = ReactElementFactory.Instance.createElement(itemContent, { item: this.item, key: this.item.id, model: this.model });
        var contentWrap = xn.createElement("div", { style: contentWrapStyle, className: this.model.cssClasses.itemBody, title: this.item.locTitle.calculatedText, onMouseOver: function (event) { _this.model.onItemHover(_this.item); }, onMouseLeave: function (event) { _this.model.onItemLeave(_this.item); } }, newElement);
        var separator = this.item.needSeparator ? xn.createElement("div", { className: this.model.cssClasses.itemSeparator }) : null;
        var isVisible = this.model.isItemVisible(this.item);
        var style = {
            display: isVisible ? null : "none"
        };
        return attachKey2click(xn.createElement("li", { className: className, role: "option", style: style, id: this.item.elementId, "aria-selected": this.model.isItemSelected(this.item), onClick: function (event) {
                _this.model.onItemClick(_this.item);
                event.stopPropagation();
            }, onPointerDown: function (event) { return _this.model.onPointerDown(event, _this.item); } },
            separator,
            contentWrap), this.item);
    };
    ListItem.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.model.onLastItemRended(this.item);
    };
    return ListItem;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-list-item", function (props) {
    return xn.createElement(list_item_ListItem, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/list/list.tsx
var list_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var list_List = /** @class */ (function (_super) {
    list_extends(List, _super);
    function List(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (event) {
            _this.model.onKeyDown(event);
        };
        _this.handleMouseMove = function (event) {
            _this.model.onMouseMove(event);
        };
        _this.state = {
            filterString: _this.model.filterString || ""
        };
        _this.listContainerRef = xn.createRef();
        return _this;
    }
    Object.defineProperty(List.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    List.prototype.getStateElement = function () {
        return this.model;
    };
    List.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (!!this.listContainerRef && !!this.listContainerRef.current) {
            this.model.initListContainerHtmlElement(this.listContainerRef.current);
        }
    };
    List.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a;
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (this.model !== prevProps.model) {
            if (this.model && !!((_a = this.listContainerRef) === null || _a === void 0 ? void 0 : _a.current)) {
                this.model.initListContainerHtmlElement(this.listContainerRef.current);
            }
            if (prevProps.model) {
                prevProps.model.initListContainerHtmlElement(undefined);
            }
        }
    };
    List.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        if (!!this.model) {
            this.model.initListContainerHtmlElement(undefined);
        }
    };
    List.prototype.renderElement = function () {
        return (xn.createElement("div", { className: this.model.cssClasses.root, ref: this.listContainerRef },
            this.searchElementContent(),
            this.emptyContent(),
            this.renderList()));
    };
    List.prototype.renderList = function () {
        if (!this.model.renderElements)
            return null;
        var items = this.renderItems();
        var ulStyle = { display: this.model.isEmpty ? "none" : null };
        return (xn.createElement("ul", { className: this.model.getListClass(), style: ulStyle, role: "listbox", id: this.model.elementId, onMouseDown: function (e) {
                e.preventDefault();
            }, onKeyDown: this.handleKeydown, onMouseMove: this.handleMouseMove }, items));
    };
    List.prototype.renderItems = function () {
        var _this = this;
        if (!this.model) {
            return null;
        }
        var items = this.model.renderedActions;
        if (!items) {
            return null;
        }
        return items.map(function (item, itemIndex) {
            return (xn.createElement(list_item_ListItem, { model: _this.model, item: item, key: "item" + itemIndex }));
        });
    };
    List.prototype.searchElementContent = function () {
        var _this = this;
        if (!this.model.showFilter)
            return null;
        else {
            var onChange = function (e) {
                var root = external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["settings"].environment.root;
                if (e.target === root.activeElement) {
                    _this.model.filterString = e.target.value;
                }
            };
            var onKeyUp = function (e) {
                _this.model.goToItems(e);
            };
            var clearButton = this.model.showSearchClearButton && !!this.model.filterString ?
                xn.createElement("button", { className: this.model.cssClasses.searchClearButtonIcon, onClick: function (event) { _this.model.onClickSearchClearButton(event); } },
                    xn.createElement(svg_icon_SvgIcon, { iconName: "icon-searchclear", size: "auto" })) : null;
            return (xn.createElement("div", { className: this.model.cssClasses.filter },
                xn.createElement("div", { className: this.model.cssClasses.filterIcon },
                    xn.createElement(svg_icon_SvgIcon, { iconName: "icon-search", size: "auto" })),
                xn.createElement("input", { type: "text", className: this.model.cssClasses.filterInput, "aria-label": this.model.filterStringPlaceholder, placeholder: this.model.filterStringPlaceholder, value: this.state.filterString, onKeyUp: onKeyUp, onChange: onChange }),
                clearButton));
        }
    };
    List.prototype.emptyContent = function () {
        var style = { display: this.model.isEmpty ? null : "none" };
        return (xn.createElement("div", { className: this.model.cssClasses.emptyContainer, style: style },
            xn.createElement("div", { className: this.model.cssClasses.emptyText, "aria-label": this.model.emptyMessage }, this.model.emptyMessage)));
    };
    return List;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-list", function (props) {
    return xn.createElement(list_List, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/progressToc.tsx
var progressToc_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var progressToc_SurveyProgressToc = /** @class */ (function (_super) {
    progressToc_extends(SurveyProgressToc, _super);
    function SurveyProgressToc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SurveyProgressToc.prototype.render = function () {
        var tocModel = this.props.model;
        var content;
        if (tocModel.isMobile) {
            content = _("div", { onClick: tocModel.togglePopup },
                _(svg_icon_SvgIcon, { iconName: tocModel.icon, size: 24 }),
                _(popup_Popup, { model: tocModel.popupModel }));
        }
        else {
            content = _(list_List, { model: tocModel.listModel });
        }
        return (_("div", { className: tocModel.containerCss }, content));
    };
    return SurveyProgressToc;
}(SurveyNavigationBase));

ReactElementFactory.Instance.registerElement("sv-navigation-toc", function (props) {
    return _(progressToc_SurveyProgressToc, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_rating.tsx
var reactquestion_rating_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var reactquestion_rating_SurveyQuestionRating = /** @class */ (function (_super) {
    reactquestion_rating_extends(SurveyQuestionRating, _super);
    function SurveyQuestionRating(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnClick = _this.handleOnClick.bind(_this);
        return _this;
    }
    Object.defineProperty(SurveyQuestionRating.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionRating.prototype.handleOnClick = function (event) {
        this.question.setValueFromClick(event.target.value);
        this.setState({ value: this.question.value });
    };
    SurveyQuestionRating.prototype.renderItem = function (item, index) {
        var renderedItem = ReactElementFactory.Instance.createElement(this.question.itemComponent, {
            question: this.question,
            item: item,
            index: index,
            key: "value" + index,
            handleOnClick: this.handleOnClick,
            isDisplayMode: this.isDisplayMode
        });
        return renderedItem;
    };
    SurveyQuestionRating.prototype.renderElement = function () {
        var _this = this;
        var cssClasses = this.question.cssClasses;
        var minText = this.question.minRateDescription
            ? this.renderLocString(this.question.locMinRateDescription)
            : null;
        var maxText = this.question.maxRateDescription
            ? this.renderLocString(this.question.locMaxRateDescription)
            : null;
        return (_("div", { className: this.question.ratingRootCss, ref: function (div) { return (_this.setControl(div)); } },
            _("fieldset", { role: "radiogroup" },
                _("legend", { role: "presentation", className: "sv-hidden" }),
                !!this.question.hasMinLabel ? _("span", { className: cssClasses.minText }, minText) : null,
                this.question.renderedRateItems.map(function (item, index) { return _this.renderItem(item, index); }),
                !!this.question.hasMaxLabel ? _("span", { className: cssClasses.maxText }, maxText) : null)));
    };
    return SurveyQuestionRating;
}(reactquestion_element_SurveyQuestionElementBase));

ReactQuestionFactory.Instance.registerQuestion("rating", function (props) {
    return _(reactquestion_rating_SurveyQuestionRating, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/rating-dropdown.tsx
var rating_dropdown_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var rating_dropdown_SurveyQuestionRatingDropdown = /** @class */ (function (_super) {
    rating_dropdown_extends(SurveyQuestionRatingDropdown, _super);
    function SurveyQuestionRatingDropdown(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionRatingDropdown.prototype.renderElement = function () {
        var cssClasses = this.question.cssClasses;
        var select = this.renderSelect(cssClasses);
        return (_("div", { className: this.question.cssClasses.rootDropdown }, select));
    };
    return SurveyQuestionRatingDropdown;
}(dropdown_base_SurveyQuestionDropdownBase));

ReactQuestionFactory.Instance.registerQuestion("sv-rating-dropdown", function (props) {
    return _(rating_dropdown_SurveyQuestionRatingDropdown, props);
});
external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["RendererFactory"].Instance.registerRenderer("rating", "dropdown", "sv-rating-dropdown");

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_expression.tsx
var reactquestion_expression_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var reactquestion_expression_SurveyQuestionExpression = /** @class */ (function (_super) {
    reactquestion_expression_extends(SurveyQuestionExpression, _super);
    function SurveyQuestionExpression(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionExpression.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionExpression.prototype.renderElement = function () {
        var _this = this;
        var cssClasses = this.question.cssClasses;
        return (_("div", { id: this.question.inputId, className: cssClasses.root, ref: function (div) { return (_this.setControl(div)); } }, this.question.formatedValue));
    };
    return SurveyQuestionExpression;
}(reactquestion_element_SurveyQuestionElementBase));

ReactQuestionFactory.Instance.registerQuestion("expression", function (props) {
    return _(reactquestion_expression_SurveyQuestionExpression, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/react-popup-survey.tsx
var react_popup_survey_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var react_popup_survey_PopupSurvey = /** @class */ (function (_super) {
    react_popup_survey_extends(PopupSurvey, _super);
    function PopupSurvey(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnExpanded = _this.handleOnExpanded.bind(_this);
        return _this;
    }
    PopupSurvey.prototype.getStateElements = function () {
        return [this.popup, this.popup.survey];
    };
    PopupSurvey.prototype.handleOnExpanded = function (event) {
        this.popup.changeExpandCollapse();
    };
    PopupSurvey.prototype.canRender = function () {
        return _super.prototype.canRender.call(this) && this.popup.isShowing;
    };
    PopupSurvey.prototype.renderElement = function () {
        var _this = this;
        var header = this.renderWindowHeader();
        var body = this.renderBody();
        var style = {};
        if (!!this.popup.renderedWidth) {
            style.width = this.popup.renderedWidth;
            style.maxWidth = this.popup.renderedWidth;
        }
        return (_("div", { className: this.popup.cssRoot, style: style, onScroll: function () { return _this.popup.onScroll(); } },
            _("div", { className: this.popup.cssRootContent },
                header,
                body)));
    };
    PopupSurvey.prototype.renderWindowHeader = function () {
        var popup = this.popup;
        var headerCss = popup.cssHeaderRoot;
        var titleCollapsed = null;
        var expandCollapseIcon;
        var closeButton = null;
        var allowFullScreenButon = null;
        if (popup.isCollapsed) {
            headerCss += " " + popup.cssRootCollapsedMod;
            titleCollapsed = this.renderTitleCollapsed(popup);
            expandCollapseIcon = this.renderExpandIcon();
        }
        else {
            expandCollapseIcon = this.renderCollapseIcon();
        }
        if (popup.allowClose) {
            closeButton = this.renderCloseButton(this.popup);
        }
        if (popup.allowFullScreen) {
            allowFullScreenButon = this.renderAllowFullScreenButon(this.popup);
        }
        return (_("div", { className: popup.cssHeaderRoot },
            titleCollapsed,
            _("div", { className: popup.cssHeaderButtonsContainer },
                allowFullScreenButon,
                _("div", { className: popup.cssHeaderCollapseButton, onClick: this.handleOnExpanded }, expandCollapseIcon),
                closeButton)));
    };
    PopupSurvey.prototype.renderTitleCollapsed = function (popup) {
        if (!popup.locTitle)
            return null;
        return _("div", { className: popup.cssHeaderTitleCollapsed }, popup.locTitle.renderedHtml);
    };
    PopupSurvey.prototype.renderExpandIcon = function () {
        return _(svg_icon_SvgIcon, { iconName: "icon-restore_16x16", size: 16 });
    };
    PopupSurvey.prototype.renderCollapseIcon = function () {
        return _(svg_icon_SvgIcon, { iconName: "icon-minimize_16x16", size: 16 });
    };
    PopupSurvey.prototype.renderCloseButton = function (popup) {
        var _this = this;
        return (_("div", { className: popup.cssHeaderCloseButton, onClick: function () {
                popup.hide();
                if (typeof _this.props.onClose == "function") {
                    _this.props.onClose();
                }
            } },
            _(svg_icon_SvgIcon, { iconName: "icon-close_16x16", size: 16 })));
    };
    PopupSurvey.prototype.renderAllowFullScreenButon = function (popup) {
        var Icon;
        if (popup.isFullScreen) {
            Icon = _(svg_icon_SvgIcon, { iconName: "icon-back-to-panel_16x16", size: 16 });
        }
        else {
            Icon = _(svg_icon_SvgIcon, { iconName: "icon-full-screen_16x16", size: 16 });
        }
        return (_("div", { className: popup.cssHeaderFullScreenButton, onClick: function () { popup.toggleFullScreen(); } }, Icon));
    };
    PopupSurvey.prototype.renderBody = function () {
        return _("div", { className: this.popup.cssBody }, this.doRender());
    };
    PopupSurvey.prototype.createSurvey = function (newProps) {
        if (!newProps)
            newProps = {};
        _super.prototype.createSurvey.call(this, newProps);
        this.popup = new external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["PopupSurveyModel"](null, this.survey);
        if (newProps.closeOnCompleteTimeout) {
            this.popup.closeOnCompleteTimeout = newProps.closeOnCompleteTimeout;
        }
        this.popup.allowClose = newProps.allowClose;
        this.popup.allowFullScreen = newProps.allowFullScreen;
        this.popup.isShowing = true;
        if (!this.popup.isExpanded && (newProps.expanded || newProps.isExpanded))
            this.popup.expand();
    };
    return PopupSurvey;
}(reactSurvey_Survey));

/**
 * Obsolete. Please use PopupSurvey
 */
var SurveyWindow = /** @class */ (function (_super) {
    react_popup_survey_extends(SurveyWindow, _super);
    function SurveyWindow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SurveyWindow;
}(react_popup_survey_PopupSurvey));


// CONCATENATED MODULE: ./packages/survey-react-ui/src/imagepicker.tsx
var imagepicker_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var imagepicker_SurveyQuestionImagePicker = /** @class */ (function (_super) {
    imagepicker_extends(SurveyQuestionImagePicker, _super);
    function SurveyQuestionImagePicker(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionImagePicker.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionImagePicker.prototype.renderElement = function () {
        var cssClasses = this.question.cssClasses;
        return (_("fieldset", { className: this.question.getSelectBaseRootCss() },
            _("legend", { className: "sv-hidden" }, this.question.locTitle.renderedHtml),
            this.question.hasColumns ? this.getColumns(cssClasses) : this.getItems(cssClasses)));
    };
    SurveyQuestionImagePicker.prototype.getColumns = function (cssClasses) {
        var _this = this;
        return this.question.columns.map(function (column, ci) {
            var items = column.map(function (item, ii) {
                return _this.renderItem("item" + ii, item, cssClasses);
            });
            return (_("div", { key: "column" + ci + _this.question.getItemsColumnKey(column), className: _this.question.getColumnClass(), role: "presentation" }, items));
        });
    };
    SurveyQuestionImagePicker.prototype.getItems = function (cssClasses) {
        var items = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            items.push(this.renderItem(key, item, cssClasses));
        }
        return items;
    };
    Object.defineProperty(SurveyQuestionImagePicker.prototype, "textStyle", {
        get: function () {
            return { marginLeft: "3px", display: "inline", position: "static" };
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionImagePicker.prototype.renderItem = function (key, item, cssClasses) {
        var renderedItem = _(imagepicker_SurveyQuestionImagePickerItem, { key: key, question: this.question, item: item, cssClasses: cssClasses });
        var survey = this.question.survey;
        var wrappedItem = null;
        if (!!survey) {
            wrappedItem = reactsurveymodel_ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
        }
        return wrappedItem !== null && wrappedItem !== void 0 ? wrappedItem : renderedItem;
    };
    return SurveyQuestionImagePicker;
}(reactquestion_element_SurveyQuestionElementBase));

var imagepicker_SurveyQuestionImagePickerItem = /** @class */ (function (_super) {
    imagepicker_extends(SurveyQuestionImagePickerItem, _super);
    function SurveyQuestionImagePickerItem(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnChange = _this.handleOnChange.bind(_this);
        return _this;
    }
    SurveyQuestionImagePickerItem.prototype.getStateElement = function () {
        return this.item;
    };
    SurveyQuestionImagePickerItem.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.reactOnStrChanged();
    };
    SurveyQuestionImagePickerItem.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.item.locImageLink.onChanged = function () { };
    };
    SurveyQuestionImagePickerItem.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        this.reactOnStrChanged();
    };
    SurveyQuestionImagePickerItem.prototype.reactOnStrChanged = function () {
        var _this = this;
        this.item.locImageLink.onChanged = function () {
            _this.setState({ locImageLinkchanged: !!_this.state && _this.state.locImageLink ? _this.state.locImageLink + 1 : 1 });
        };
    };
    Object.defineProperty(SurveyQuestionImagePickerItem.prototype, "cssClasses", {
        get: function () {
            return this.props.cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionImagePickerItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionImagePickerItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionImagePickerItem.prototype.handleOnChange = function (event) {
        if (this.question.isReadOnlyAttr)
            return;
        if (this.question.multiSelect) {
            if (event.target.checked) {
                this.question.value = this.question.value.concat(event.target.value);
            }
            else {
                var currValue = this.question.value;
                currValue.splice(this.question.value.indexOf(event.target.value), 1);
                this.question.value = currValue;
            }
        }
        else {
            this.question.value = event.target.value;
        }
        this.setState({ value: this.question.value });
    };
    SurveyQuestionImagePickerItem.prototype.renderElement = function () {
        var _this = this;
        var item = this.item;
        var question = this.question;
        var cssClasses = this.cssClasses;
        var isChecked = question.isItemSelected(item);
        var itemClass = question.getItemClass(item);
        var text = null;
        if (question.showLabel) {
            text = (_("span", { className: question.cssClasses.itemText }, item.text ? reactquestion_element_SurveyElementBase.renderLocString(item.locText) : item.value));
        }
        var style = { objectFit: this.question.imageFit };
        var control = null;
        if (item.locImageLink.renderedHtml && this.question.contentMode === "image") {
            control = (_("img", { className: cssClasses.image, src: item.locImageLink.renderedHtml, width: this.question.renderedImageWidth, height: this.question.renderedImageHeight, alt: item.locText.renderedHtml, style: style, onLoad: function (event) { _this.question["onContentLoaded"](item, event.nativeEvent); }, onError: function (event) { item.onErrorHandler(item, event.nativeEvent); } }));
        }
        if (item.locImageLink.renderedHtml && this.question.contentMode === "video") {
            control = (_("video", { controls: true, className: cssClasses.image, src: item.locImageLink.renderedHtml, width: this.question.renderedImageWidth, height: this.question.renderedImageHeight, style: style, onLoadedMetadata: function (event) { _this.question["onContentLoaded"](item, event.nativeEvent); }, onError: function (event) { item.onErrorHandler(item, event.nativeEvent); } }));
        }
        if (!item.locImageLink.renderedHtml || item.contentNotLoaded) {
            var style_1 = {
                width: this.question.renderedImageWidth,
                height: this.question.renderedImageHeight,
                objectFit: this.question.imageFit
            };
            control = (_("div", { className: cssClasses.itemNoImage, style: style_1 }, cssClasses.itemNoImageSvgIcon ?
                _(svg_icon_SvgIcon, { className: cssClasses.itemNoImageSvgIcon, iconName: this.question.cssClasses.itemNoImageSvgIconId, size: 48 }) :
                null));
        }
        var renderedItem = (_("div", { className: itemClass },
            _("label", { className: cssClasses.label },
                _("input", { className: cssClasses.itemControl, id: this.question.getItemId(item), type: this.question.inputType, name: this.question.questionName, checked: isChecked, value: item.value, disabled: !this.question.getItemEnabled(item), readOnly: this.question.isReadOnlyAttr, onChange: this.handleOnChange, "aria-required": this.question.ariaRequired, "aria-label": this.question.ariaLabel, "aria-invalid": this.question.ariaInvalid, "aria-errormessage": this.question.ariaErrormessage }),
                _("div", { className: this.question.cssClasses.itemDecorator },
                    _("div", { className: this.question.cssClasses.imageContainer },
                        !!this.question.cssClasses.checkedItemDecorator ?
                            _("span", { className: this.question.cssClasses.checkedItemDecorator }, !!this.question.cssClasses.checkedItemSvgIconId ? _(svg_icon_SvgIcon, { size: "auto", className: this.question.cssClasses.checkedItemSvgIcon, iconName: this.question.cssClasses.checkedItemSvgIconId }) : null) : null,
                        control),
                    text))));
        return renderedItem;
    };
    return SurveyQuestionImagePickerItem;
}(ReactSurveyElement));

ReactQuestionFactory.Instance.registerQuestion("imagepicker", function (props) {
    return _(imagepicker_SurveyQuestionImagePicker, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/image.tsx
var image_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var image_SurveyQuestionImage = /** @class */ (function (_super) {
    image_extends(SurveyQuestionImage, _super);
    function SurveyQuestionImage(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionImage.prototype.componentDidMount = function () {
        var _this = this;
        _super.prototype.componentDidMount.call(this);
        this.question.locImageLink.onChanged = function () {
            _this.forceUpdate();
        };
    };
    SurveyQuestionImage.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.question.locImageLink.onChanged = function () { };
    };
    Object.defineProperty(SurveyQuestionImage.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionImage.prototype.renderElement = function () {
        var _this = this;
        var cssClasses = this.question.getImageCss();
        var style = { objectFit: this.question.imageFit, width: this.question.renderedStyleWidth, height: this.question.renderedStyleHeight };
        if (!this.question.imageLink || this.question.contentNotLoaded) {
            style["display"] = "none";
        }
        var control = null;
        if (this.question.renderedMode === "image") {
            control = (_("img", { className: cssClasses, src: this.question.locImageLink.renderedHtml, alt: this.question.altText || this.question.title, width: this.question.renderedWidth, height: this.question.renderedHeight, 
                //alt={item.text || item.value}
                style: style, onLoad: function (event) { _this.question.onLoadHandler(); }, onError: function (event) { _this.question.onErrorHandler(); } }));
        }
        if (this.question.renderedMode === "video") {
            control = (_("video", { controls: true, className: cssClasses, src: this.question.locImageLink.renderedHtml, width: this.question.renderedWidth, height: this.question.renderedHeight, style: style, onLoadedMetadata: function (event) { _this.question.onLoadHandler(); }, onError: function (event) { _this.question.onErrorHandler(); } }));
        }
        if (this.question.renderedMode === "youtube") {
            control = (_("iframe", { className: cssClasses, src: this.question.locImageLink.renderedHtml, width: this.question.renderedWidth, height: this.question.renderedHeight, style: style }));
        }
        var noImage = null;
        if (!this.question.imageLink || this.question.contentNotLoaded) {
            noImage = (_("div", { className: this.question.cssClasses.noImage },
                _(svg_icon_SvgIcon, { iconName: this.question.cssClasses.noImageSvgIconId, size: 48 })));
        }
        return _("div", { className: this.question.cssClasses.root },
            control,
            noImage);
    };
    return SurveyQuestionImage;
}(reactquestion_element_SurveyQuestionElementBase));

ReactQuestionFactory.Instance.registerQuestion("image", function (props) {
    return _(image_SurveyQuestionImage, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/signaturepad.tsx
var signaturepad_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var signaturepad_SurveyQuestionSignaturePad = /** @class */ (function (_super) {
    signaturepad_extends(SurveyQuestionSignaturePad, _super);
    function SurveyQuestionSignaturePad(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { value: _this.question.value };
        return _this;
    }
    Object.defineProperty(SurveyQuestionSignaturePad.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionSignaturePad.prototype.renderElement = function () {
        var _this = this;
        var cssClasses = this.question.cssClasses;
        var loadingIndicator = this.question.showLoadingIndicator ? this.renderLoadingIndicator() : null;
        var clearButton = this.renderCleanButton();
        return (_("div", { className: cssClasses.root, ref: function (root) { return (_this.setControl(root)); }, style: { width: this.question.renderedCanvasWidth } },
            _("div", { className: cssClasses.placeholder, style: { display: this.question.needShowPlaceholder() ? "" : "none" } }, this.renderLocString(this.question.locRenderedPlaceholder)),
            _("div", null,
                this.renderBackgroundImage(),
                _("canvas", { tabIndex: -1, className: this.question.cssClasses.canvas, onBlur: function (event) { _this.question.onBlur(event); } })),
            clearButton,
            loadingIndicator));
    };
    SurveyQuestionSignaturePad.prototype.renderBackgroundImage = function () {
        if (!this.question.backgroundImage)
            return null;
        return _("img", { className: this.question.cssClasses.backgroundImage, src: this.question.backgroundImage, style: { width: this.question.renderedCanvasWidth } });
    };
    SurveyQuestionSignaturePad.prototype.renderLoadingIndicator = function () {
        return _("div", { className: this.question.cssClasses.loadingIndicator },
            _(loading_indicator_LoadingIndicatorComponent, null));
    };
    SurveyQuestionSignaturePad.prototype.renderCleanButton = function () {
        var _this = this;
        if (!this.question.canShowClearButton)
            return null;
        var cssClasses = this.question.cssClasses;
        return _("div", { className: cssClasses.controls },
            _("button", { type: "button", className: cssClasses.clearButton, title: this.question.clearButtonCaption, onClick: function () { return _this.question.clearValue(true); } }, this.question.cssClasses.clearButtonIconId ? _(svg_icon_SvgIcon, { iconName: this.question.cssClasses.clearButtonIconId, size: "auto" }) : _("span", null, "\u2716")));
    };
    return SurveyQuestionSignaturePad;
}(reactquestion_element_SurveyQuestionElementBase));

ReactQuestionFactory.Instance.registerQuestion("signaturepad", function (props) {
    return _(signaturepad_SurveyQuestionSignaturePad, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_buttongroup.tsx
var reactquestion_buttongroup_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var reactquestion_buttongroup_SurveyQuestionButtonGroup = /** @class */ (function (_super) {
    reactquestion_buttongroup_extends(SurveyQuestionButtonGroup, _super);
    function SurveyQuestionButtonGroup(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyQuestionButtonGroup.prototype, "question", {
        get: function () {
            return this.questionBase;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionButtonGroup.prototype.getStateElement = function () {
        return this.question;
    };
    SurveyQuestionButtonGroup.prototype.renderElement = function () {
        var items = this.renderItems();
        return xn.createElement("div", { className: this.question.cssClasses.root }, items);
    };
    SurveyQuestionButtonGroup.prototype.renderItems = function () {
        var _this = this;
        return this.question.visibleChoices.map(function (item, index) {
            return (xn.createElement(reactquestion_buttongroup_SurveyButtonGroupItem, { key: _this.question.inputId + "_" + index, item: item, question: _this.question, index: index }));
        });
    };
    return SurveyQuestionButtonGroup;
}(reactquestion_element_SurveyQuestionElementBase));

var reactquestion_buttongroup_SurveyButtonGroupItem = /** @class */ (function (_super) {
    reactquestion_buttongroup_extends(SurveyButtonGroupItem, _super);
    function SurveyButtonGroupItem(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(SurveyButtonGroupItem.prototype, "index", {
        get: function () {
            return this.props.index;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyButtonGroupItem.prototype, "question", {
        get: function () {
            return this.props.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyButtonGroupItem.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyButtonGroupItem.prototype.getStateElement = function () {
        return this.item;
    };
    SurveyButtonGroupItem.prototype.renderElement = function () {
        this.model = new external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["ButtonGroupItemModel"](this.question, this.item, this.index);
        var icon = this.renderIcon();
        var input = this.renderInput();
        var caption = this.renderCaption();
        return (xn.createElement("label", { role: "radio", className: this.model.css.label, title: this.model.caption.renderedHtml },
            input,
            xn.createElement("div", { className: this.model.css.decorator },
                icon,
                caption)));
    };
    SurveyButtonGroupItem.prototype.renderIcon = function () {
        if (!!this.model.iconName) {
            return (xn.createElement(svg_icon_SvgIcon, { className: this.model.css.icon, iconName: this.model.iconName, size: this.model.iconSize || 24 }));
        }
        return null;
    };
    SurveyButtonGroupItem.prototype.renderInput = function () {
        var _this = this;
        return (xn.createElement("input", { className: this.model.css.control, id: this.model.id, type: "radio", name: this.model.name, checked: this.model.selected, value: this.model.value, disabled: this.model.readOnly, onChange: function () {
                _this.model.onChange();
            }, "aria-required": this.model.isRequired, "aria-label": this.model.caption.renderedHtml, "aria-invalid": this.model.hasErrors, "aria-errormessage": this.model.describedBy, role: "radio" }));
    };
    SurveyButtonGroupItem.prototype.renderCaption = function () {
        if (!this.model.showCaption)
            return null;
        var caption = this.renderLocString(this.model.caption);
        return (xn.createElement("span", { className: this.model.css.caption, title: this.model.caption.renderedHtml }, caption));
    };
    return SurveyButtonGroupItem;
}(reactquestion_element_SurveyElementBase));

// ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
//   return React.createElement(SurveyQuestionButtonGroup, props);
// });

// CONCATENATED MODULE: ./packages/survey-react-ui/src/reactquestion_custom.tsx
var reactquestion_custom_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var reactquestion_custom_SurveyQuestionCustom = /** @class */ (function (_super) {
    reactquestion_custom_extends(SurveyQuestionCustom, _super);
    function SurveyQuestionCustom(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionCustom.prototype.getStateElements = function () {
        var res = _super.prototype.getStateElements.call(this);
        if (!!this.question.contentQuestion) {
            res.push(this.question.contentQuestion);
        }
        return res;
    };
    SurveyQuestionCustom.prototype.renderElement = function () {
        return reactquestion_SurveyQuestion.renderQuestionBody(this.creator, this.question.contentQuestion);
    };
    return SurveyQuestionCustom;
}(reactquestion_element_SurveyQuestionUncontrolledElement));

var reactquestion_custom_SurveyQuestionComposite = /** @class */ (function (_super) {
    reactquestion_custom_extends(SurveyQuestionComposite, _super);
    function SurveyQuestionComposite(props) {
        return _super.call(this, props) || this;
    }
    SurveyQuestionComposite.prototype.canRender = function () {
        return !!this.question.contentPanel;
    };
    SurveyQuestionComposite.prototype.renderElement = function () {
        return (_(panel_SurveyPanel, { element: this.question.contentPanel, creator: this.creator, survey: this.question.survey }));
    };
    return SurveyQuestionComposite;
}(reactquestion_element_SurveyQuestionUncontrolledElement));

ReactQuestionFactory.Instance.registerQuestion("custom", function (props) {
    return _(reactquestion_custom_SurveyQuestionCustom, props);
});
ReactQuestionFactory.Instance.registerQuestion("composite", function (props) {
    return _(reactquestion_custom_SurveyQuestionComposite, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/list/list-item-content.tsx
var list_item_content_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var list_item_content_ListItemContent = /** @class */ (function (_super) {
    list_item_content_extends(ListItemContent, _super);
    function ListItemContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ListItemContent.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ListItemContent.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    ListItemContent.prototype.getStateElement = function () {
        return this.item;
    };
    ListItemContent.prototype.render = function () {
        if (!this.item)
            return null;
        var content = [];
        var text = this.renderLocString(this.item.locTitle, undefined, "locString");
        if (this.item.iconName) {
            var icon = xn.createElement(svg_icon_SvgIcon, { key: "icon", className: this.model.cssClasses.itemIcon, iconName: this.item.iconName, size: this.item.iconSize, "aria-label": this.item.title });
            content.push(icon);
            content.push(xn.createElement("span", { key: "text" }, text));
        }
        else {
            content.push(text);
        }
        if (this.item.markerIconName) {
            var icon = xn.createElement(svg_icon_SvgIcon, { key: "marker", className: this.item.cssClasses.itemMarkerIcon, iconName: this.item.markerIconName, size: this.item.markerIconSize });
            content.push(icon);
        }
        return xn.createElement(xn.Fragment, null, content);
    };
    return ListItemContent;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-list-item-content", function (props) {
    return xn.createElement(list_item_content_ListItemContent, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/list/list-item-group.tsx
var list_item_group_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var list_item_group_ListItemGroup = /** @class */ (function (_super) {
    list_item_group_extends(ListItemGroup, _super);
    function ListItemGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ListItemGroup.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ListItemGroup.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    ListItemGroup.prototype.getStateElement = function () {
        return this.item;
    };
    ListItemGroup.prototype.render = function () {
        var _a;
        if (!this.item)
            return null;
        var newElement = ReactElementFactory.Instance.createElement("sv-list-item-content", { item: this.item, key: "content" + this.item.id, model: this.model });
        return xn.createElement(xn.Fragment, null,
            newElement,
            xn.createElement(popup_Popup, { model: (_a = this.item) === null || _a === void 0 ? void 0 : _a.popupModel }));
    };
    return ListItemGroup;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-list-item-group", function (props) {
    return xn.createElement(list_item_group_ListItemGroup, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/survey-header/logo-image.tsx
var logo_image_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var logo_image_LogoImage = /** @class */ (function (_super) {
    logo_image_extends(LogoImage, _super);
    function LogoImage(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(LogoImage.prototype, "survey", {
        get: function () {
            return this.props.data;
        },
        enumerable: false,
        configurable: true
    });
    LogoImage.prototype.render = function () {
        var content = [];
        content.push(xn.createElement("div", { key: "logo-image", className: this.survey.logoClassNames },
            xn.createElement("img", { className: this.survey.css.logoImage, src: this.survey.locLogo.renderedHtml, alt: this.survey.locTitle.renderedHtml, width: this.survey.renderedLogoWidth, height: this.survey.renderedLogoHeight, style: { objectFit: this.survey.logoFit, width: this.survey.renderedStyleLogoWidth, height: this.survey.renderedStyleLogoHeight } })));
        return xn.createElement(xn.Fragment, null, content);
    };
    return LogoImage;
}(xn.Component));

ReactElementFactory.Instance.registerElement("sv-logo-image", function (props) {
    return xn.createElement(logo_image_LogoImage, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/matrix-actions/remove-button/remove-button.tsx
var remove_button_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var remove_button_SurveyQuestionMatrixDynamicRemoveButton = /** @class */ (function (_super) {
    remove_button_extends(SurveyQuestionMatrixDynamicRemoveButton, _super);
    function SurveyQuestionMatrixDynamicRemoveButton(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnRowRemoveClick = _this.handleOnRowRemoveClick.bind(_this);
        return _this;
    }
    Object.defineProperty(SurveyQuestionMatrixDynamicRemoveButton.prototype, "question", {
        get: function () {
            return this.props.item.data.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixDynamicRemoveButton.prototype, "row", {
        get: function () {
            return this.props.item.data.row;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixDynamicRemoveButton.prototype.handleOnRowRemoveClick = function (event) {
        this.question.removeRowUI(this.row);
    };
    SurveyQuestionMatrixDynamicRemoveButton.prototype.renderElement = function () {
        var removeRowText = this.renderLocString(this.question.locRemoveRowText);
        return (xn.createElement("button", { className: this.question.getRemoveRowButtonCss(), type: "button", onClick: this.handleOnRowRemoveClick, disabled: this.question.isInputReadOnly },
            removeRowText,
            xn.createElement("span", { className: this.question.cssClasses.iconRemove })));
    };
    return SurveyQuestionMatrixDynamicRemoveButton;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("sv-matrix-remove-button", function (props) {
    return xn.createElement(remove_button_SurveyQuestionMatrixDynamicRemoveButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/matrix-actions/detail-button/detail-button.tsx
var detail_button_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var detail_button_SurveyQuestionMatrixDetailButton = /** @class */ (function (_super) {
    detail_button_extends(SurveyQuestionMatrixDetailButton, _super);
    function SurveyQuestionMatrixDetailButton(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnShowHideClick = _this.handleOnShowHideClick.bind(_this);
        return _this;
    }
    SurveyQuestionMatrixDetailButton.prototype.getStateElement = function () {
        return this.props.item;
    };
    Object.defineProperty(SurveyQuestionMatrixDetailButton.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixDetailButton.prototype, "question", {
        get: function () {
            return this.props.item.data.question;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionMatrixDetailButton.prototype, "row", {
        get: function () {
            return this.props.item.data.row;
        },
        enumerable: false,
        configurable: true
    });
    SurveyQuestionMatrixDetailButton.prototype.handleOnShowHideClick = function (event) {
        this.row.showHideDetailPanelClick();
    };
    SurveyQuestionMatrixDetailButton.prototype.renderElement = function () {
        var isExpanded = this.row.isDetailPanelShowing;
        var ariaExpanded = isExpanded;
        var ariaControls = isExpanded ? this.row.detailPanelId : undefined;
        return (xn.createElement("button", { type: "button", onClick: this.handleOnShowHideClick, className: this.question.getDetailPanelButtonCss(this.row), "aria-expanded": ariaExpanded, "aria-controls": ariaControls },
            xn.createElement(svg_icon_SvgIcon, { className: this.question.getDetailPanelIconCss(this.row), iconName: this.question.getDetailPanelIconId(this.row), size: "auto" })));
    };
    return SurveyQuestionMatrixDetailButton;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("sv-matrix-detail-button", function (props) {
    return xn.createElement(detail_button_SurveyQuestionMatrixDetailButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/paneldynamic-actions/paneldynamic-remove-btn.tsx
var paneldynamic_remove_btn_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var paneldynamic_remove_btn_SurveyQuestionPanelDynamicRemoveButton = /** @class */ (function (_super) {
    paneldynamic_remove_btn_extends(SurveyQuestionPanelDynamicRemoveButton, _super);
    function SurveyQuestionPanelDynamicRemoveButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (event) {
            _this.question.removePanelUI(_this.data.panel);
        };
        return _this;
    }
    SurveyQuestionPanelDynamicRemoveButton.prototype.renderElement = function () {
        var btnText = this.renderLocString(this.question.locPanelRemoveText);
        var id = this.question.getPanelRemoveButtonId(this.data.panel);
        return (xn.createElement("button", { id: id, className: this.question.getPanelRemoveButtonCss(), onClick: this.handleClick, type: "button" },
            xn.createElement("span", { className: this.question.cssClasses.buttonRemoveText }, btnText),
            xn.createElement("span", { className: this.question.cssClasses.iconRemove })));
    };
    return SurveyQuestionPanelDynamicRemoveButton;
}(SurveyQuestionPanelDynamicAction));

ReactElementFactory.Instance.registerElement("sv-paneldynamic-remove-btn", function (props) {
    return xn.createElement(paneldynamic_remove_btn_SurveyQuestionPanelDynamicRemoveButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/survey-actions/survey-nav-button.tsx
var survey_nav_button_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var survey_nav_button_SurveyNavigationButton = /** @class */ (function (_super) {
    survey_nav_button_extends(SurveyNavigationButton, _super);
    function SurveyNavigationButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SurveyNavigationButton.prototype, "item", {
        get: function () {
            return this.props.item;
        },
        enumerable: false,
        configurable: true
    });
    SurveyNavigationButton.prototype.canRender = function () {
        return this.item.isVisible;
    };
    SurveyNavigationButton.prototype.renderElement = function () {
        return (xn.createElement("input", { className: this.item.innerCss, type: "button", disabled: this.item.disabled, onMouseDown: this.item.data && this.item.data.mouseDown, onClick: this.item.action, title: this.item.getTooltip(), value: this.item.title }));
    };
    return SurveyNavigationButton;
}(ReactSurveyElement));

ReactElementFactory.Instance.registerElement("sv-nav-btn", function (props) {
    return xn.createElement(survey_nav_button_SurveyNavigationButton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/string-viewer.tsx
var string_viewer_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var string_viewer_SurveyLocStringViewer = /** @class */ (function (_super) {
    string_viewer_extends(SurveyLocStringViewer, _super);
    function SurveyLocStringViewer(props) {
        var _this = _super.call(this, props) || this;
        _this.onChangedHandler = function (sender, options) {
            if (_this.isRendering)
                return;
            _this.setState({ changed: !!_this.state && _this.state.changed ? _this.state.changed + 1 : 1 });
        };
        _this.rootRef = xn.createRef();
        return _this;
    }
    Object.defineProperty(SurveyLocStringViewer.prototype, "locStr", {
        get: function () {
            return this.props.locStr;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyLocStringViewer.prototype, "style", {
        get: function () {
            return this.props.style;
        },
        enumerable: false,
        configurable: true
    });
    SurveyLocStringViewer.prototype.componentDidMount = function () {
        this.reactOnStrChanged();
    };
    SurveyLocStringViewer.prototype.componentWillUnmount = function () {
        if (!this.locStr)
            return;
        this.locStr.onStringChanged.remove(this.onChangedHandler);
    };
    SurveyLocStringViewer.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (!!prevProps.locStr) {
            prevProps.locStr.onStringChanged.remove(this.onChangedHandler);
        }
        this.reactOnStrChanged();
    };
    SurveyLocStringViewer.prototype.reactOnStrChanged = function () {
        if (!this.locStr)
            return;
        this.locStr.onStringChanged.add(this.onChangedHandler);
    };
    SurveyLocStringViewer.prototype.render = function () {
        if (!this.locStr)
            return null;
        this.isRendering = true;
        var strEl = this.renderString();
        this.isRendering = false;
        return strEl;
    };
    SurveyLocStringViewer.prototype.renderString = function () {
        var className = this.locStr.allowLineBreaks ? "sv-string-viewer sv-string-viewer--multiline" : "sv-string-viewer";
        if (this.locStr.hasHtml) {
            var htmlValue = { __html: this.locStr.renderedHtml };
            return xn.createElement("span", { ref: this.rootRef, className: className, style: this.style, dangerouslySetInnerHTML: htmlValue });
        }
        return xn.createElement("span", { ref: this.rootRef, className: className, style: this.style }, this.locStr.renderedHtml);
    };
    return SurveyLocStringViewer;
}(xn.Component));

ReactElementFactory.Instance.registerElement(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["LocalizableString"].defaultRenderer, function (props) {
    return xn.createElement(string_viewer_SurveyLocStringViewer, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/question-error.tsx
var question_error_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var question_error_QuestionErrorComponent = /** @class */ (function (_super) {
    question_error_extends(QuestionErrorComponent, _super);
    function QuestionErrorComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuestionErrorComponent.prototype.render = function () {
        return (xn.createElement("div", null,
            xn.createElement("span", { className: this.props.cssClasses.error.icon || undefined, "aria-hidden": "true" }),
            xn.createElement("span", { className: this.props.cssClasses.error.item || undefined },
                xn.createElement(string_viewer_SurveyLocStringViewer, { locStr: this.props.error.locText }))));
    };
    return QuestionErrorComponent;
}(xn.Component));

ReactElementFactory.Instance.registerElement("sv-question-error", function (props) {
    return xn.createElement(question_error_QuestionErrorComponent, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/skeleton.tsx
var skeleton_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var skeleton_Skeleton = /** @class */ (function (_super) {
    skeleton_extends(Skeleton, _super);
    function Skeleton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Skeleton.prototype.render = function () {
        var _a, _b;
        return (xn.createElement("div", { className: "sv-skeleton-element", id: (_a = this.props.element) === null || _a === void 0 ? void 0 : _a.id, style: { height: (_b = this.props.element) === null || _b === void 0 ? void 0 : _b.skeletonHeight } }));
    };
    return Skeleton;
}(xn.Component));

ReactElementFactory.Instance.registerElement("sv-skeleton", function (props) {
    return xn.createElement(skeleton_Skeleton, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/components/header.tsx
var header_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var header_HeaderMobile = /** @class */ (function (_super) {
    header_extends(HeaderMobile, _super);
    function HeaderMobile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HeaderMobile.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    HeaderMobile.prototype.renderLogoImage = function () {
        var componentName = this.model.survey.getElementWrapperComponentName(this.model.survey, "logo-image");
        var componentData = this.model.survey.getElementWrapperComponentData(this.model.survey, "logo-image");
        return ReactElementFactory.Instance.createElement(componentName, {
            data: componentData,
        });
    };
    HeaderMobile.prototype.render = function () {
        return (xn.createElement("div", { className: "sv-header--mobile" },
            this.model.survey.hasLogo ? (xn.createElement("div", { className: "sv-header__logo" }, this.renderLogoImage())) : null,
            this.model.survey.hasTitle ? (xn.createElement("div", { className: "sv-header__title", style: { maxWidth: this.model.textAreaWidth } },
                xn.createElement(title_element_TitleElement, { element: this.model.survey }))) : null,
            this.model.survey.renderedHasDescription ? (xn.createElement("div", { className: "sv-header__description", style: { maxWidth: this.model.textAreaWidth } },
                xn.createElement("div", { className: this.model.survey.css.description }, reactquestion_element_SurveyElementBase.renderLocString(this.model.survey.locDescription)))) : null));
    };
    return HeaderMobile;
}(xn.Component));

var header_HeaderCell = /** @class */ (function (_super) {
    header_extends(HeaderCell, _super);
    function HeaderCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HeaderCell.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    HeaderCell.prototype.renderLogoImage = function () {
        var componentName = this.model.survey.getElementWrapperComponentName(this.model.survey, "logo-image");
        var componentData = this.model.survey.getElementWrapperComponentData(this.model.survey, "logo-image");
        return ReactElementFactory.Instance.createElement(componentName, {
            data: componentData,
        });
    };
    HeaderCell.prototype.render = function () {
        return (xn.createElement("div", { className: this.model.css, style: this.model.style },
            xn.createElement("div", { className: "sv-header__cell-content", style: this.model.contentStyle },
                this.model.showLogo ? (xn.createElement("div", { className: "sv-header__logo" }, this.renderLogoImage())) : null,
                this.model.showTitle ? (xn.createElement("div", { className: "sv-header__title", style: { maxWidth: this.model.textAreaWidth } },
                    xn.createElement(title_element_TitleElement, { element: this.model.survey }))) : null,
                this.model.showDescription ? (xn.createElement("div", { className: "sv-header__description", style: { maxWidth: this.model.textAreaWidth } },
                    xn.createElement("div", { className: this.model.survey.css.description }, reactquestion_element_SurveyElementBase.renderLocString(this.model.survey.locDescription)))) : null)));
    };
    return HeaderCell;
}(xn.Component));

var header_Header = /** @class */ (function (_super) {
    header_extends(Header, _super);
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Header.prototype, "model", {
        get: function () {
            return this.props.model;
        },
        enumerable: false,
        configurable: true
    });
    Header.prototype.getStateElement = function () {
        return this.model;
    };
    Header.prototype.renderElement = function () {
        this.model.survey = this.props.survey;
        if (!(this.props.survey.headerView === "advanced")) {
            return null;
        }
        var headerContent = null;
        if (this.props.survey.isMobile) {
            headerContent = xn.createElement(header_HeaderMobile, { model: this.model });
        }
        else {
            headerContent = (xn.createElement("div", { className: this.model.contentClasses, style: { maxWidth: this.model.maxWidth } }, this.model.cells.map(function (cell, index) { return xn.createElement(header_HeaderCell, { key: index, model: cell }); })));
        }
        return (xn.createElement("div", { className: this.model.headerClasses, style: { height: this.model.renderedHeight } },
            this.model.backgroundImage ? xn.createElement("div", { style: this.model.backgroundImageStyle, className: this.model.backgroundImageClasses }) : null,
            headerContent));
    };
    return Header;
}(reactquestion_element_SurveyElementBase));

ReactElementFactory.Instance.registerElement("sv-header", function (props) {
    return xn.createElement(header_Header, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/src/string-editor.tsx
var string_editor_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var string_editor_SurveyLocStringEditor = /** @class */ (function (_super) {
    string_editor_extends(SurveyLocStringEditor, _super);
    function SurveyLocStringEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.onInput = function (event) {
            _this.locStr.text = event.target.innerText;
        };
        _this.onClick = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        _this.state = { changed: 0 };
        return _this;
    }
    Object.defineProperty(SurveyLocStringEditor.prototype, "locStr", {
        get: function () {
            return this.props.locStr;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SurveyLocStringEditor.prototype, "style", {
        get: function () {
            return this.props.style;
        },
        enumerable: false,
        configurable: true
    });
    SurveyLocStringEditor.prototype.componentDidMount = function () {
        if (!this.locStr)
            return;
        var self = this;
        this.locStr.onChanged = function () {
            self.setState({ changed: self.state.changed + 1 });
        };
    };
    SurveyLocStringEditor.prototype.componentWillUnmount = function () {
        if (!this.locStr)
            return;
        this.locStr.onChanged = function () { };
    };
    SurveyLocStringEditor.prototype.render = function () {
        if (!this.locStr) {
            return null;
        }
        if (this.locStr.hasHtml) {
            var htmlValue = { __html: this.locStr.renderedHtml };
            return (xn.createElement("span", { className: "sv-string-editor", contentEditable: "true", suppressContentEditableWarning: true, style: this.style, dangerouslySetInnerHTML: htmlValue, onBlur: this.onInput, onClick: this.onClick }));
        }
        return (xn.createElement("span", { className: "sv-string-editor", contentEditable: "true", suppressContentEditableWarning: true, style: this.style, onBlur: this.onInput, onClick: this.onClick }, this.locStr.renderedHtml));
    };
    return SurveyLocStringEditor;
}(xn.Component));

ReactElementFactory.Instance.registerElement(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["LocalizableString"].editableRenderer, function (props) {
    return xn.createElement(string_editor_SurveyLocStringEditor, props);
});

// CONCATENATED MODULE: ./packages/survey-react-ui/entries/react-ui-model.ts
// react





















































































//Uncomment to include the "date" question type.
//export {default as SurveyQuestionDate} from "../plugins/react/reactquestiondate";

// CONCATENATED MODULE: ./src/entries/core-export.ts




// CONCATENATED MODULE: ./src/entries/js-ui.ts
var js_ui_assign = (undefined && undefined.__assign) || function () {
    js_ui_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return js_ui_assign.apply(this, arguments);
};



// eslint-disable-next-line surveyjs/no-imports-from-entries


function renderSurvey(model, element, props) {
    if (props === void 0) { props = {}; }
    var survey = _(reactSurvey_Survey, js_ui_assign({ model: model }, props));
    compat_module_$(survey, element);
}
function renderPopupSurvey(model, element, props) {
    if (props === void 0) { props = {}; }
    var survey = _(react_popup_survey_PopupSurvey, js_ui_assign({ model: model }, props));
    compat_module_$(survey, element);
}
function doPopupSurvey(props) {
    return this.each(function () {
        renderPopupSurvey(props.model, this, props);
    });
}
var gcontext = globalThis;
if (typeof globalThis === "undefined")
    gcontext = window;
var jQueryInst = gcontext["jQuery"] || gcontext["$"];
if (typeof jQueryInst !== "undefined") {
    initJquery(jQueryInst);
}
else {
    try {
        jQueryInst = __webpack_require__(/*! jquery */ "jquery");
        initJquery(jQueryInst);
    }
    catch (ex) {
    }
}
function initJquery(instance) {
    instance["fn"].extend({
        Survey: function (props) {
            return this.each(function () {
                renderSurvey(props.model, this, props);
            });
        },
        PopupSurvey: doPopupSurvey,
        SurveyWindow: doPopupSurvey
    });
}
external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyModel"].platform = "js-ui";
external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["SurveyModel"].prototype["render"] = function (element) {
    if (element === void 0) { element = null; }
    if (this.renderCallback) {
        this.renderCallback();
    }
    else {
        renderSurvey(this, element);
    }
};
var preact = compat_module_namespaceObject;




Object(external_root_Survey_commonjs2_survey_core_commonjs_survey_core_amd_survey_core_["checkLibraryVersion"])("" + "1.12.9", "survey-js-ui");


/***/ }),

/***/ "jquery":
/*!******************************************************************************************!*\
  !*** external {"root":"jQuery","commonjs2":"jquery","commonjs":"jquery","amd":"jquery"} ***!
  \******************************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_jquery__ === 'undefined') {var e = new Error("Cannot find module 'undefined'"); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_jquery__;

/***/ }),

/***/ "survey-core":
/*!*********************************************************************************************************!*\
  !*** external {"root":"Survey","commonjs2":"survey-core","commonjs":"survey-core","amd":"survey-core"} ***!
  \*********************************************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_survey_core__;

/***/ })

/******/ });
});
//# sourceMappingURL=survey-js-ui.js.map