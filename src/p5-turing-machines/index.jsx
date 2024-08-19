import State from "./classes/state";
import TemporaryLink from "./classes/temporaryLink";
import StartLink from "./classes/startLink";
import SelfLink from "./classes/selfLink";
import Link from "./classes/link";
import { createHistory } from "./utils/history";
import { MT } from "./classes/simulation/mt";
import TapeBounds from "./assets/tape-bounds.svg";
import TapeHead from "./assets/tape-head.svg";

export const sketch = (p5) => {
  // General Properties
  let cnvIsFocused = "outside";
  p5.globalWindowOffset = { x: 0, y: 0 };
  let fs = false;
  let mtCreated = null;

  // States
  let states = [];
  let stateRadius = 25;
  let lastSelectedState = null;
  p5.selectedObject = null;

  // Links
  let links = [];
  let startLink = null;
  let currentLink = null;

  // Scaling
  let scalingCanvasSlider = null;
  p5.globalScaleFactor = 1.0;

  // Moving canvas view
  p5.movingCanvasOffset = { x: 0, y: 0 };

  // Context menu
  let contextMenu = null;

  // Creating HTML Elements
  function createMTDoomWrapper() {
    let mtDoomWrapper = p5.createElement("div", "");
    mtDoomWrapper.id("mt-doom-wrapper");
    mtDoomWrapper.class("w-full max-w-[75rem] flex flex-col justify-center rounded-[.5rem]");

    let topToolbar = createTopToolbar();
    topToolbar.parent(mtDoomWrapper);

    let playgroundContainer = p5.createElement("div", "");
    playgroundContainer.id("playground-container");
    playgroundContainer.class(
      "relative w-full h-full rounded-b-[.5rem] border-r-[.5rem] border-b-[.5rem] border-[--color-white] flex",
    );
    playgroundContainer.parent(mtDoomWrapper);

    let leftSidebar = createCanvasLeftSidebar();
    leftSidebar.parent(playgroundContainer);

    let mainContent = p5.createElement("div", "");
    mainContent.id("main-content");
    mainContent.class("w-full flex flex-col justify-center relative overflow-hidden");
    mainContent.parent(playgroundContainer);

    let canvasContainer = p5.createElement("div", "");
    canvasContainer.id("canvas-container");
    canvasContainer.class("w-full h-full");
    canvasContainer.parent(mainContent);

    createCanvasBottomDrawer().parent(mainContent);

    return mtDoomWrapper;
  }

  function createTopToolbar() {
    let topToolbar = p5.createElement("div", "");
    topToolbar.id("top-toolbar");
    topToolbar.class(
      "w-full flex justify-between items-center bg-[--color-white] px-[2rem] py-[1rem] rounded-t-[.5rem]",
    );

    let leftDiv = p5.createElement("div", "");
    leftDiv.parent(topToolbar);
    leftDiv.class("flex items-center jusi gap-1");

    // let collapseButton = p5.createElement("button", "<span class='material-symbols-outlined' style='font-size: 2rem'>keyboard_arrow_right</span>");
    // collapseButton.class("w-[2.6rem] h-[2.6rem] text-white flex items-center justify-center transition-transform rotate-90");
    // collapseButton.parent(leftDiv);
    // collapseButton.mousePressed(() => {
    //   collapseButton.toggleClass("rotate-90");
    //   let playgroundContainer = p5.select("#playground-container");
    //   if (playgroundContainer.height === 0) {
    //     playgroundContainer.style("height", "40rem");
    //   } else {
    //     playgroundContainer.style("height", "0");
    //   }
    // });

    let mtTitle = p5.createElement("p", "Máquina de Estados 01");
    mtTitle.class("text-[1.4rem] text-white font-bold mt-title");
    mtTitle.parent(leftDiv);

    let rightDiv = p5.createElement("div", "");
    rightDiv.class("flex items-center gap-1");
    rightDiv.parent(topToolbar);

    let fullscreenButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 1.8rem'>fullscreen</span>",
    );
    fullscreenButton.class("w-[2.6rem] h-[2.6rem] text-white flex items-center justify-center");
    fullscreenButton.id("fullscreenButton");
    fullscreenButton.parent(rightDiv);
    fullscreenButton.mousePressed(() => {
      fs = !fs;
      cnvIsFocused = "menu";
    });

    return topToolbar;
  }

  function createCanvasLeftSidebar() {
    let leftSidebar = p5.createElement("div", "");
    leftSidebar.id("top-menu");
    leftSidebar.class("bg-[--color-white] flex flex-col justify-between items-center");

    let topArea = p5.createElement("div", "");
    topArea.id("topArea");
    topArea.class("flex flex-col items-center");
    topArea.parent(leftSidebar);

    let bottomMenu = p5.createElement("div", "");
    bottomMenu.id("bottom-drawer");
    bottomMenu.class("flex flex-col items-center");
    bottomMenu.parent(leftSidebar);

    // Top menu buttons
    const topMenuButtons = [
      {
        id: "select",
        icon: "arrow_selector_tool",
        tipType: "tip",
        tipMessage: "Selecione ou mova um elemento do canvas ao clicar sobre ele",
        tipDirection: "left",
        mousePressed: () => setMenuMousePressed("select"),
      },
      {
        id: "move",
        icon: "open_with",
        tipType: "tip",
        tipMessage: "Pressione e arraste dentro do canvas para mover a visualização",
        tipDirection: "left",
        mousePressed: () => setMenuMousePressed("move"),
      },
      {
        id: "addState",
        icon: "add_circle",
        tipType: "tip",
        tipMessage: "Adiciona um novo estado de MT ao canvas no local clicado",
        tipDirection: "left",
        mousePressed: () => setMenuMousePressed("addState"),
      },
      {
        id: "addLink",
        icon: "arrow_right_alt",
        tipType: "tip",
        tipMessage:
          "Adiciona uma transição entre estados da MT no canvas, também pode ser utilizado para definir estado inicial",
        tipDirection: "left",
        mousePressed: () => setMenuMousePressed("addLink"),
      },
      {
        id: "delete",
        icon: "close",
        tipType: "tip",
        tipMessage: "Deleta um elemento do canvas ao clicar sobre ele",
        tipDirection: "left",
        mousePressed: () => setMenuMousePressed("delete"),
      },
      {
        id: "cleanAll",
        icon: "remove_selection",
        tipType: "tip",
        tipMessage: "Limpa todo o canvas",
        tipDirection: "left",
        mousePressed: () => {
          if (confirm("Você tem certeza que deseja limpar o canvas?")) {
            states = [];
            links = [];
            startLink = null;
            currentLink = null;
            lastSelectedState = null;
            p5.selectedObject = null;
            mtCreated = null;
            createHistory(p5);
          }
        },
      },
    ];

    topMenuButtons.forEach((btn) => {
      let toolTipWrapper = p5.createElement("div", "");
      toolTipWrapper.class("tooltip-wrapper");
      toolTipWrapper.parent(topArea);
      let button = p5.createElement(
        "button",
        `<span class='material-symbols-outlined' style='font-size: 1.6rem'>${btn.icon}</span>`,
      );
      button.id(btn.id);
      button.class(
        "w-[5rem] h-[3.6rem] flex items-center justify-center text-white hover:bg-[--color-primary] transition-colors",
      );
      button.mousePressed(btn.mousePressed);
      button.parent(toolTipWrapper);

      let toolTip = p5.createElement("div", "");
      toolTip.class(`tooltip ${btn.tipDirection}`);
      toolTip.parent(toolTipWrapper);
      let toolTipContent = p5.createElement("div", "");
      toolTipContent.class("flex flex-col justify-center text-white");
      toolTipContent.parent(toolTip);
      let title = p5.createElement("span", "Dica!");
      title.class("title");
      title.parent(toolTipContent);
      let description = p5.createElement("p", btn.tipMessage);
      description.class("description");
      description.parent(toolTipContent);
    });

    // Bottom input file hidden
    inputFile = p5.createFileInput(handleInputFile);
    inputFile.attribute("accept", ".json");
    inputFile.position(-1000, -1000);
    inputFile.hide();

    // Bottom menu buttons with tooltips
    let importTooltipWrapper = p5.createElement("div", "");
    importTooltipWrapper.class("tooltip-wrapper");
    importTooltipWrapper.parent(bottomMenu);
    let importButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 1.6rem'>upload_file</span>",
    );
    importButton.class(
      "w-[5rem] h-[3.6rem] flex items-center justify-center text-white hover:bg-[--color-primary] transition-colors",
    );
    importButton.id("import-button");
    importButton.mousePressed(() => {
      cnvIsFocused = "menu";
      closeFloatingCanvasMenus();
      inputFile.elt.click();
    });
    importButton.parent(importTooltipWrapper);
    let importTooltip = p5.createElement("div", "");
    importTooltip.class("tooltip left");
    importTooltip.parent(importTooltipWrapper);
    let importTooltipContent = p5.createElement("div", "");
    importTooltipContent.class("flex flex-col justify-center text-white");
    importTooltipContent.parent(importTooltip);
    let title = p5.createElement("span", "Dica!");
    title.class("title");
    title.parent(importTooltipContent);
    let description = p5.createElement("p", "Importar arquivo de MT (.json)");
    description.class("description");
    description.parent(importTooltipContent);

    let exportMenuWrapper = p5.createElement("div", "");
    exportMenuWrapper.class("relative");
    exportMenuWrapper.parent(bottomMenu);

    let exportTooltipWrapper = p5.createElement("div", "");
    exportTooltipWrapper.class("tooltip-wrapper");
    exportTooltipWrapper.id("export-tooltip-wrapper");
    exportTooltipWrapper.parent(exportMenuWrapper);
    let exportButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 1.6rem'>download</span>",
    );
    exportButton.class(
      "w-[5rem] h-[3.6rem] flex items-center justify-center text-white hover:bg-[--color-primary] transition-colors",
    );
    exportButton.id("export-button-toggle");
    exportButton.mousePressed(() => toggleExportMenu());
    exportButton.parent(exportTooltipWrapper);
    let exportTooltip = p5.createElement("div", "");
    exportTooltip.class("tooltip left");
    exportTooltip.parent(exportTooltipWrapper);
    let exportTooltipContent = p5.createElement("div", "");
    exportTooltipContent.class("flex flex-col justify-center text-white");
    exportTooltipContent.parent(exportTooltip);
    let exportTitle = p5.createElement("span", "Dica!");
    exportTitle.class("title");
    exportTitle.parent(exportTooltipContent);
    let exportDescription = p5.createElement("p", "Exportar MT como imagem (.png) ou arquivo (.json)");
    exportDescription.class("description");
    exportDescription.parent(exportTooltipContent);

    let floatingExportMenu = p5.createElement("div", "");
    floatingExportMenu.class("export-tooltip left");
    floatingExportMenu.id("floating-export-menu");
    floatingExportMenu.parent(exportMenuWrapper);

    let exportAsPNGButton = p5.createElement("button", "Exportar como imagem");
    exportAsPNGButton.class(
      "w-full h-[2.4rem] rounded-[.2rem] px-[1rem] mt-[.5rem] text-left text-white text-[1rem] font-medium hover:bg-[#5F5F5F] transition-colors z-[5]",
    );
    exportAsPNGButton.id("export-as-png");
    exportAsPNGButton.mousePressed(() => exportAsPNG());
    exportAsPNGButton.parent(floatingExportMenu);

    let exportAsJSONButton = p5.createElement("button", "Exportar como arquivo DTM");
    exportAsJSONButton.class(
      "w-full h-[2.4rem] rounded-[.2rem] px-[1rem] mt-[.5rem] text-left text-white text-[1rem] font-medium hover:bg-[#5F5F5F] transition-colors z-[5]",
    );
    exportAsJSONButton.id("export-as-dtm");
    exportAsJSONButton.mousePressed(() => exportAsJSON());
    exportAsJSONButton.parent(floatingExportMenu);

    let zoomInTooltipWrapper = p5.createElement("div", "");
    zoomInTooltipWrapper.class("tooltip-wrapper");
    zoomInTooltipWrapper.parent(bottomMenu);
    let zoomInButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 1.8rem'>zoom_in</span>",
    );
    zoomInButton.class(
      "w-[5rem] h-[3.6rem] flex items-center justify-center text-white hover:bg-[--color-primary] transition-colors",
    );
    zoomInButton.id("zoom-in");
    zoomInButton.mousePressed(() => {
      cnvIsFocused = "menu";
      p5.globalScaleFactor = min(2.0, p5.globalScaleFactor + 0.25);
    });
    zoomInButton.parent(zoomInTooltipWrapper);
    let zoomInTooltip = p5.createElement("div", "");
    zoomInTooltip.class("tooltip left");
    zoomInTooltip.parent(zoomInTooltipWrapper);
    let zoomInTooltipContent = p5.createElement("div", "");
    zoomInTooltipContent.class("flex flex-col justify-center text-white");
    zoomInTooltipContent.parent(zoomInTooltip);
    let zoomInTitle = p5.createElement("span", "Dica!");
    zoomInTitle.class("title");
    zoomInTitle.parent(zoomInTooltipContent);
    let zoomInDescription = p5.createElement("p", "Aumentar zoom do canvas");
    zoomInDescription.class("description");
    zoomInDescription.parent(zoomInTooltipContent);

    let zoomOutTooltipWrapper = p5.createElement("div", "");
    zoomOutTooltipWrapper.class("tooltip-wrapper");
    zoomOutTooltipWrapper.parent(bottomMenu);
    let zoomOutButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 1.8rem'>zoom_out</span>",
    );
    zoomOutButton.class(
      "w-[5rem] h-[3.6rem] flex items-center justify-center text-white hover:bg-[--color-primary] transition-colors",
    );
    zoomOutButton.id("zoom-out");
    zoomOutButton.mousePressed(() => {
      cnvIsFocused = "menu";
      p5.globalScaleFactor = max(0.5, p5.globalScaleFactor - 0.25);
    });
    zoomOutButton.parent(zoomOutTooltipWrapper);
    let zoomOutTooltip = p5.createElement("div", "");
    zoomOutTooltip.class("tooltip left");
    zoomOutTooltip.parent(zoomOutTooltipWrapper);
    let zoomOutTooltipContent = p5.createElement("div", "");
    zoomOutTooltipContent.class("flex flex-col justify-center text-white");
    zoomOutTooltipContent.parent(zoomOutTooltip);
    let zoomOutTitle = p5.createElement("span", "Dica!");
    zoomOutTitle.class("title");
    zoomOutTitle.parent(zoomOutTooltipContent);
    let zoomOutDescription = p5.createElement("p", "Diminuir zoom do canvas");
    zoomOutDescription.class("description");
    zoomOutDescription.parent(zoomOutTooltipContent);

    return leftSidebar;
  }

  function openBottomDrawer() {
    let bottomDrawerContent = p5.select("#bottom-drawer-content");
    bottomDrawerContent.removeClass("hidden");
    bottomDrawerContent.removeClass("pb-[.5rem]");
  }

  function closeBottomDrawer() {
    let bottomDrawerContent = p5.select("#bottom-drawer-content");
    bottomDrawerContent.addClass("hidden");
    bottomDrawerContent.addClass("pb-[.5rem]");

    let toggleButtons = p5.selectAll("#bottom-drawer-buttons button");
    toggleButtons.forEach((btn) => {
      btn.removeClass("bg-[--color-primary]");
      btn.removeClass("border-[--color-primary]");
      btn.removeClass("active");
      updateUIWhenSimulating(false, false, false);
    });
  }

  // MT functions

  function createMT() {
    let q = new Set(states.map((state) => state.id));
    let sigma = new Set(); // I don't need this
    let gamma = new Set();
    let startState = startLink ? startLink.state.id : null;
    let endStates = new Set(states.filter((state) => state.isEndState).map((state) => state.id));

    if (startState === null || endStates.size === 0) {
      let tapeDiv = p5.select("#tape-div");
      tapeDiv.html("");
      tapeDiv.show();

      let wrapperAlertDiv = p5.createElement("div", "");
      wrapperAlertDiv.class("w-full flex flex-col items-center justify-center gap-[.5rem]");
      wrapperAlertDiv.parent(tapeDiv);

      if (startState === null) {
        let initialStateAlertDiv = p5.createDiv("Defina um estado inicial!");
        initialStateAlertDiv.class(
          "w-full py-[.5rem] flex items-center justify-center bg-[#ff0000] rounded-[.5rem] text-white text-[1.4rem]",
        );
        initialStateAlertDiv.parent(wrapperAlertDiv);
      }

      if (endStates.size === 0) {
        let endStateAlertDiv = p5.createDiv("Defina pelo menos um estado final!");
        endStateAlertDiv.class(
          "mt-[.5rem] w-full py-[.5rem] flex items-center justify-center bg-[#ff0000] rounded-[.5rem] text-white text-[1.4rem]",
        );
        endStateAlertDiv.parent(wrapperAlertDiv);
      }

      return null;
    }

    // Break the rules into read, write, direction
    links.forEach((link) => {
      link.transitionBox.rules.forEach((rule) => {
        let ruleBreak = rule.label.filter((r) => r !== " " && r !== "→" && r !== ", ");
        gamma.add(ruleBreak[0]);
        gamma.add(ruleBreak[1]);
      });
    });

    // Create the delta
    let delta = {};

    links.forEach((link) => {
      let stateA = null;
      let stateB = null;

      if (link instanceof SelfLink) {
        stateA = link.state.id;
        stateB = link.state.id;
      } else {
        stateA = link.stateA.id;
        stateB = link.stateB.id;
      }

      if (!delta[stateA]) delta[stateA] = {};

      link.transitionBox.rules.forEach((rule) => {
        let ruleBreak = rule.label.filter((r) => r !== " " && r !== "→" && r !== ", ");

        if (!delta[stateA][ruleBreak[0]]) delta[stateA][ruleBreak[0]] = {};

        let mappingMove = {
          E: -1,
          D: 1,
          P: 0,
        };
        delta[stateA][ruleBreak[0]] = {
          write: ruleBreak[1],
          move: mappingMove[ruleBreak[2]],
          nextState: stateB,
        };
      });
    });

    return new MT(q, sigma, gamma, delta, startState, endStates);
  }

  function updateUIWhenSimulating(accepted, end, labOpened = false) {
    if (!mtCreated) return;
    states.forEach((state) => {
      state.simulating = false;
      if (state.id === mtCreated.currentState && labOpened) state.simulating = true;
    });

    if (accepted && end) {
      let tapeDiv = p5.select("#tape-div");
      tapeDiv.show();
      tapeDiv.removeClass("bg-[#ff0000]");
      tapeDiv.addClass("bg-[#6cfe6c]");
      tapeDiv.addClass("filter-[blur(1rem)]");

      tapeDiv.removeClass("word-rejected");
      tapeDiv.addClass("word-accepeted");

      // alert("Word accepted!");
    } else if (!accepted && end) {
      let tapeDiv = p5.select("#tape-div");
      tapeDiv.show();
      tapeDiv.removeClass("bg-[#6cfe6c]");
      tapeDiv.addClass("bg-[#ff0000]");

      tapeDiv.removeClass("word-accepeted");
      tapeDiv.addClass("word-rejected");

      // alert("Word rejected!");
    } else {
      let tapeDiv = p5.select("#tape-div");
      tapeDiv.show();
      tapeDiv.removeClass("bg-[#ff0000]");
      tapeDiv.removeClass("bg-[#6cfe6c]");

      tapeDiv.removeClass("word-rejected");
      tapeDiv.removeClass("word-accepeted");
    }
  }

  function fastSimulationReset() {
    mtCreated = null;
    createTape();
    updateUIWhenSimulating(false, false, true);
  }

  function backwardSimulation() {
    if (!mtCreated) return;
    mtCreated.backwardSimulation();
    createTape();

    updateUIWhenSimulating(false, false, true);
  }

  function forwardSimulation() {
    if (!mtCreated) {
      mtCreated = createMT();
      if (!mtCreated) return;

      mtCreated.simulatedWord = p5.select("#input-word").value();
      mtCreated.tape = p5.select("#input-word").value().split("");
    }

    const { accepted, end } = mtCreated.forwardSimulation();
    createTape();

    updateUIWhenSimulating(accepted, end, true);
  }

  function fastSimulation() {
    mtCreated = createMT();
    if (!mtCreated) return;
    let inputWord = p5.select("#input-word").value();

    // const { accepted, end } = mtCreated.fastSimulation(inputWord, parseInt(p5.select("#max-steps").value()));
    const { accepted, end } = mtCreated.fastSimulation(inputWord, 1000);
    createTape();

    updateUIWhenSimulating(accepted, end, true);
  }

  function simulationButtonActivation() {
    let fastResetButton = p5.select("#fast-reset-button");
    let backwardSimulationButton = p5.select("#backward-simulation-button");
    let forwardSimulationButton = p5.select("#forward-simulation-button");
    let fastSimulationButton = p5.select("#fast-simulation-button");

    let diactivatedClass =
      "w-[3rem] h-[2.6rem] rounded-[.4rem] text-white bg-[#4B4B4B] flex items-center justify-center";
    let activatedClass =
      "w-[3rem] h-[2.6rem] rounded-[.4rem] text-white bg-[--color-primary] flex items-center justify-center active-class";

    fastResetButton.class(diactivatedClass);
    backwardSimulationButton.class(diactivatedClass);
    forwardSimulationButton.class(diactivatedClass);
    fastSimulationButton.class(diactivatedClass);

    if (!mtCreated) {
      forwardSimulationButton.class(activatedClass);
      fastSimulationButton.class(activatedClass);
    } else {
      if (mtCreated.history.length > 0) {
        fastResetButton.class(activatedClass);
        backwardSimulationButton.class(activatedClass);
      }

      if (!p5.select("#tape-div").hasClass("word-accepted") && !p5.select("#tape-div").hasClass("word-rejected")) {
        if (
          !(
            mtCreated.endStates.has(mtCreated.currentState) &&
            mtCreated.maxInterectedIndex >= mtCreated.simulatedWord.length
          )
        ) {
          forwardSimulationButton.class(activatedClass);
          fastSimulationButton.class(activatedClass);
        }
      }
    }
  }

  // End MT functions #############################

  function createTape() {
    let tapeDiv = p5.select("#tape-div");
    if (!tapeDiv) return;

    if (!mtCreated) {
      tapeDiv.html("");
      tapeDiv.hide();

      mtCreated = createMT();
      if (!mtCreated) return;
      mtCreated.tape = p5.select("#input-word").value().split("");
    }

    tapeDiv.html("");
    tapeDiv.hide();
    if (mtCreated.tape.length === 0) return;

    tapeDiv.show();
    let tapeWrapper = p5.createElement("div", "");
    tapeWrapper.class("flex items-center justify-center");
    tapeWrapper.parent(tapeDiv);

    let tapeBoundsImage = p5.createImg(TapeBounds);
    tapeBoundsImage.class("h-[2.5rem] mt-[.1rem]");
    tapeBoundsImage.parent(tapeWrapper);

    for (let i = 0; i < mtCreated.tape.length; i++) {
      let tapeCell = p5.createElement("div", "");
      tapeCell.class(
        "relative w-[3rem] h-[2.4rem] bg-white border-x-[.05rem] border-[--color-white] text-[1.4rem] font-semibold text-[dark-white] flex items-center justify-center",
      );
      tapeCell.parent(tapeWrapper);
      let span = p5.createElement("span", mtCreated.tape[i]);
      span.parent(tapeCell);

      // Tape head
      if (i === mtCreated.head) {
        let tapeHead = p5.createDiv(`<img src='${TapeHead}' class='w-[2.2rem] h-[2.2rem]'>`);
        tapeHead.class("absolute -bottom-[1.2rem]");
        tapeHead.parent(tapeCell);
      }
    }

    let tapeBoundsImage2 = p5.createImg(TapeBounds);
    tapeBoundsImage2.class("h-[2.5rem] rotate-180 mt-[.01rem]");
    tapeBoundsImage2.parent(tapeWrapper);
  }

  function createCanvasBottomDrawer() {
    let bottomWrapper = p5.createElement("div", "");
    bottomWrapper.class("absolute bottom-0 min-w-full px-[.5rem]");
    let bottomDrawer = p5.createElement("div", "");
    bottomDrawer.id("bottom-drawer");
    bottomDrawer.class(
      "w-full flex flex-col items-center justify-center gap-[1rem] bg-[--color-white] pt-[.5rem] rounded-t-[1rem]",
    );
    bottomDrawer.parent(bottomWrapper);

    // let maximizeIcon = p5.createElement("span");
    // maximizeIcon.class("material-symbols-outlined text-white h-0 mb-[1rem]");
    // maximizeIcon.style("font-size", "2rem");
    // maximizeIcon.html("maximize");
    // maximizeIcon.id("handle-bottom-drawer");
    // maximizeIcon.parent(bottomDrawer);

    let bottomDrawerButtons = p5.createElement("div", "");
    bottomDrawerButtons.class("flex items center gap-[1rem]");
    bottomDrawerButtons.id("bottom-drawer-buttons");
    bottomDrawerButtons.parent(bottomDrawer);

    let buttons = [
      {
        icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048">
        <path fill="white"
          d="M1859 1758q14 23 21 47t7 51q0 40-15 75t-41 61t-61 41t-75 15H354q-40 0-75-15t-61-41t-41-61t-15-75q0-27 6-51t21-47l569-992q10-14 10-34V128H640V0h768v128h-128v604q0 19 10 35zM896 732q0 53-27 99l-331 577h972l-331-577q-27-46-27-99V128H896zm799 1188q26 0 44-19t19-45q0-10-2-17t-8-16l-164-287H464l-165 287q-9 15-9 33q0 26 18 45t46 19z" />
      </svg>`,
        mousePressed: (btn) => {
          if (btn) {
            btn.toggleClass("bg-[--color-primary]");
            btn.toggleClass("border-[--color-primary]");
            btn.toggleClass("active");

            if (btn.hasClass("active")) {
              openBottomDrawer();
              fastSimulationReset();
              if (mtCreated) {
                mtCreated.simulatedWord = p5.select("#input-word").value();
                if (mtCreated.simulatedWord.length === 0) mtCreated.tape = [mtCreated.blankSymbol];
              }
              createTape();
              updateUIWhenSimulating(false, false, true);
            } else {
              closeBottomDrawer();
              updateUIWhenSimulating(false, false, false);
            }

            closeExportMenu();
            closeFloatingCanvasMenus();
          }
        },
        id: "lab-test",
      },
      // { icon: "lab_panel", mousePressed: () => {} },
      // { icon: "settings", mousePressed: () => {} },
    ];

    buttons.forEach((btn) => {
      let button = p5.createElement("button", btn.icon);
      button.id(btn.id);
      button.class(
        "w-[3rem] h-[3rem] rounded-[.4rem] text-white border-[.1rem] flex items-center justify-center outline-none",
      );
      button.mousePressed(() => btn.mousePressed(button));
      button.parent(bottomDrawerButtons);
    });

    let bottomDrawerContent = p5.createElement("div", "");
    bottomDrawerContent.class("w-full flex flex-col items-center px-[2rem] gap-[.5rem] pb-[1rem] pb-[.5rem] hidden");
    bottomDrawerContent.parent(bottomDrawer);
    bottomDrawerContent.id("bottom-drawer-content");

    let inputWordDiv = p5.createElement("div", "");
    inputWordDiv.class("w-full flex items-center gap-[.5rem]");
    inputWordDiv.parent(bottomDrawerContent);

    let inputWordLabel = p5.createElement("label", "Entrada");
    inputWordLabel.class("text-white text-[1.4rem]");
    inputWordLabel.parent(inputWordDiv);

    let inputWord = p5.createElement("input", "");
    inputWord.attribute("type", "search");
    inputWord.attribute("placeholder", "Digite uma palavra para simular");
    inputWord.attribute("maxlength", "200");
    inputWord.attribute("autocomplete", "off");
    inputWord.id("input-word");
    inputWord.class(
      "w-full h-[2.8rem] px-[1rem] rounded-[.4rem] focus:outline-none bg-transparent border-2 border-[--color-primary] text-[1.4rem] text-white autofill:bg-yellow-200",
    );
    inputWord.parent(inputWordDiv);
    inputWord.input(() => {
      mtCreated = createMT();
      if (!mtCreated) return;
      mtCreated.simulatedWord = inputWord.value();
      if (mtCreated.simulatedWord.length > 0) mtCreated.tape = inputWord.value().split("");
      else mtCreated.tape = [mtCreated.blankSymbol];

      createTape();

      states.forEach((state) => {
        state.simulating = false;
        if (state.id === mtCreated.currentState) state.simulating = true;
      });

      updateUIWhenSimulating(false, false, true);
    });

    // let clearButton = p5.createElement("button", "Limpar");
    // clearButton.class("h-[2.8rem] px-[1rem] text-white text-[1.4rem] rounded-[.4rem] bg-[--color-background]");
    // clearButton.parent(inputWordDiv);
    // clearButton.mousePressed(() => {
    //   inputWord.value("");
    //   mtCreated = createMT();
    //   createTape();

    //   states.forEach((state) => {
    //     state.simulating = false;
    //     if (state.id === mtCreated.currentState) state.simulating = true;
    //   });

    //   updateUIWhenSimulating(false, false, true);
    // });

    let bottomDrawerSimulationButtons = p5.createElement("div", "");
    bottomDrawerSimulationButtons.class("flex items-center justify-between");
    bottomDrawerSimulationButtons.parent(inputWordDiv);

    let bottomDrawerSimulationButtonsLeft = p5.createElement("div", "");
    bottomDrawerSimulationButtonsLeft.class("flex items-center justify-center gap-[.5rem]");
    bottomDrawerSimulationButtonsLeft.parent(bottomDrawerSimulationButtons);

    let fastResetButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 2rem'>skip_previous</span>",
    );
    fastResetButton.class(
      "w-[3rem] h-[2.6rem] rounded-[.4rem] text-white bg-[#4B4B4B] flex items-center justify-center",
    );
    fastResetButton.id("fast-reset-button");
    fastResetButton.parent(bottomDrawerSimulationButtonsLeft);
    fastResetButton.mousePressed(() => {
      if (fastResetButton.hasClass("active-class")) fastSimulationReset();
    });

    let backwardSimulationButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 2rem'>chevron_left</span>",
    );
    backwardSimulationButton.class(
      "w-[3rem] h-[2.6rem] rounded-[.4rem] text-white bg-[#4B4B4B] flex items-center justify-center",
    );
    backwardSimulationButton.id("backward-simulation-button");
    backwardSimulationButton.parent(bottomDrawerSimulationButtonsLeft);
    backwardSimulationButton.mousePressed(() => {
      if (backwardSimulationButton.hasClass("active-class")) backwardSimulation();
    });

    // let playButton = p5.createElement("button", "<span class='material-symbols-outlined' style='font-size: 2rem'>play_arrow</span>");
    // playButton.class("w-[3rem] h-[2.6rem] rounded-[.4rem] text-white bg-[--color-primary] flex items-center justify-center");
    // playButton.id("play-button");
    // playButton.parent(bottomDrawerSimulationButtonsLeft);

    let forwardSimulationButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 2rem'>chevron_right</span>",
    );
    forwardSimulationButton.class(
      "w-[3rem] h-[2.6rem] rounded-[.4rem] text-white bg-[--color-primary] flex items-center justify-center active-class",
    );
    forwardSimulationButton.id("forward-simulation-button");
    forwardSimulationButton.parent(bottomDrawerSimulationButtonsLeft);
    forwardSimulationButton.mousePressed(() => {
      if (forwardSimulationButton.hasClass("active-class")) forwardSimulation();
    });

    let fastSimulationButton = p5.createElement(
      "button",
      "<span class='material-symbols-outlined' style='font-size: 2rem'>skip_next</span>",
    );
    fastSimulationButton.class(
      "w-[3rem] h-[2.6rem] rounded-[.4rem] text-white bg-[--color-primary] flex items-center justify-center active-class",
    );
    fastSimulationButton.id("fast-simulation-button");
    fastSimulationButton.parent(bottomDrawerSimulationButtonsLeft);
    fastSimulationButton.mousePressed(() => {
      if (fastSimulationButton.hasClass("active-class")) fastSimulation();
    });

    let bottomDrawerSimulationButtonsRight = p5.createElement("div", "");
    bottomDrawerSimulationButtonsRight.class("flex items-center gap-[3rem]");
    bottomDrawerSimulationButtonsRight.parent(bottomDrawerSimulationButtons);

    // let pauseIntervalDiv = p5.createElement("div", "");
    // pauseIntervalDiv.class("flex items center gap-[.5rem] text-white text-[1.2rem]");
    // pauseIntervalDiv.parent(bottomDrawerSimulationButtonsRight);

    // let pauseIntervalLabel = p5.createElement("label", "Pausa");
    // pauseIntervalLabel.parent(pauseIntervalDiv);

    // let pauseIntervalInput = p5.createElement("input", "");
    // pauseIntervalInput.attribute("type", "range");
    // pauseIntervalInput.attribute("id", "interval-pause");
    // pauseIntervalInput.attribute("min", "0.1");
    // pauseIntervalInput.attribute("max", "3");
    // pauseIntervalInput.attribute("step", "0.1");
    // pauseIntervalInput.attribute("value", "2");
    // pauseIntervalInput.class("w-[10rem] accent-[--color-primary]");
    // pauseIntervalInput.parent(pauseIntervalDiv);
    // pauseIntervalDiv.input(() => {
    //   let pauseIntervalSpan = p5.select("#interval-pause-span");
    //   // One decimal place
    //   let convertedValue = parseFloat(pauseIntervalInput.value()).toFixed(1);
    //   if (pauseIntervalSpan) pauseIntervalSpan.html(convertedValue + "s");
    // });

    // let pauseIntervalSpan = p5.createElement("span", "1.5s");
    // pauseIntervalSpan.id("interval-pause-span");
    // pauseIntervalSpan.parent(pauseIntervalDiv);

    // let maxStepsDiv = p5.createElement("div", "");
    // maxStepsDiv.class("flex items center gap-[.5rem] text-white text-[1.2rem]");
    // maxStepsDiv.parent(bottomDrawerSimulationButtonsRight);

    // let maxStepsLabel = p5.createElement("label", "Max. passos.");
    // maxStepsLabel.parent(maxStepsDiv);

    // let maxStepsInput = p5.createElement("input", "");
    // maxStepsInput.attribute("type", "range");
    // maxStepsInput.attribute("id", "max-steps");
    // maxStepsInput.attribute("min", "100");
    // maxStepsInput.attribute("max", "900");
    // maxStepsInput.attribute("step", "50");
    // maxStepsInput.attribute("value", "500");
    // maxStepsInput.class("w-[10rem] accent-[--color-primary]");
    // maxStepsInput.parent(maxStepsDiv);
    // maxStepsInput.input(() => {
    //   let maxStepsSpan = p5.select("#max-steps-span");
    //   if (maxStepsSpan) maxStepsSpan.html(maxStepsInput.value());
    // });

    // let maxStepsSpan = p5.createElement("span", "500");
    // maxStepsSpan.id("max-steps-span");
    // maxStepsSpan.parent(maxStepsDiv);

    let tapeDiv = p5.createElement("div", "");
    tapeDiv.class("w-full py-[.2rem] rounded-[.4rem] flex items-center justify-center");
    tapeDiv.id("tape-div");
    tapeDiv.parent(bottomDrawerContent);

    return bottomWrapper;
  }

  function createContextMenu() {
    let mainDiv = p5.createElement("div", "");
    mainDiv.id("context-menu");
    mainDiv.hide();
    mainDiv.parent("playground-container");
    mainDiv.elt.addEventListener("contextmenu", (event) => event.preventDefault());
    mainDiv.class("absolute bg-[#222831] py-[.8rem] rounded-[5px] flex flex-col gap-[.5rem] drop-shadow-md");
    mainDiv.position(p5.globalWindowOffset.x + 100, p5.globalWindowOffset.y + 100);

    let options = [
      {
        label: "Estado inicial",
        id: "set-initial-state",
        class:
          "w-full py-[.5rem] px-[1rem] text-left hover:bg-[--color-primary-hover] transition-colors text-white text-[1.2rem]",
        mousePressed: () => {
          if (p5.selectedObject) {
            let index = states.findIndex((state) => state.id === p5.selectedObject.object.id);
            setInitialState(index);
            createHistory(p5);
          }
        },
      },
      {
        label: "Definir como Final",
        id: "set-final-state",
        class:
          "w-full py-[.5rem] px-[1rem] text-left hover:bg-[--color-primary-hover] transition-colors text-white text-[1.2rem]",
        mousePressed: () => {
          toggleFinalState();
          createHistory(p5);
        },
      },
      {
        label: "Renomear Estado",
        id: "rename-state",
        class:
          "w-full py-[.5rem] px-[1rem] text-left hover:bg-[--color-primary-hover] transition-colors text-white text-[1.2rem] flex items-center justify-between border-y-[1px] border-[#36404e]",
        mousePressed: () => renameState(),
      },
      {
        label: "Deletar",
        id: "delete-state",
        class:
          "w-full py-[.5rem] px-[1rem] text-left hover:bg-[--color-primary-hover] transition-colors text-white text-[1.2rem] flex items-center justify-between",
        mousePressed: () => {
          cnvIsFocused = "export-menu";
          deleteObject();
          contextMenu.hide();
        },
      },
    ];

    options.forEach((option) => {
      let button = p5.createElement("button", option.label);
      button.id(option.id);
      button.class(option.class);
      button.mousePressed(option.mousePressed);
      button.parent(mainDiv);
    });

    let deleteButton = p5.select("#delete-state");
    let iElement = p5.createElement("i");
    iElement.class("fa-solid fa-trash text-[#676768] text-[12px]");
    iElement.parent(deleteButton);

    return mainDiv;
  }

  // Left Sidebar Menu Button functions
  let leftSidebar = null;
  p5.selectedLeftSidebarButton = null;

  function setSelectedMenuButton(buttonId = null) {
    p5.selectedLeftSidebarButton = buttonId;
    let leftMenuButtons = p5.selectAll("#top-menu button");

    if (leftMenuButtons) {
      if (buttonId) {
        let selectedButton = p5.select(`#${buttonId}`);
        selectedButton.addClass("bg-[--color-primary-hover]");
      }

      leftMenuButtons.forEach((btn) => {
        if (btn.elt.id !== buttonId) btn.removeClass("bg-[--color-primary-hover]");
      });
    }

    unSelectAllObjects();
    closeExportMenu();
    closeFloatingCanvasMenus();
  }

  function setMenuMousePressed(buttonId = null) {
    if (p5.mouseButton === p5.LEFT) {
      cnvIsFocused = "menu";
      setSelectedMenuButton(buttonId);
    }
  }

  // Extra Menu functions
  function closeFloatingCanvasMenus() {
    if (contextMenu) contextMenu.hide();

    if (states.some((state) => state.input.visible)) {
      createHistory(p5);
      states.forEach((state) => (state.input.visible = false));
    }
  }

  // Export functions
  let exportButton = null;
  let exportAsPNGButton = null;
  let exportAsDMTButton = null;

  function closeExportMenu() {
    let floatingMenu = p5.select("#floating-export-menu");
    if (!floatingMenu.hasClass("hidden")) {
      floatingMenu.removeClass("flex");
      floatingMenu.addClass("hidden");
    }
  }

  function toggleExportMenu() {
    cnvIsFocused = "export-menu";
    if (!p5.selectedLeftSidebarButton) setSelectedMenuButton("select");

    closeFloatingCanvasMenus();

    let floatingMenu = p5.select("#floating-export-menu");
    // if hidden, show it
    if (floatingMenu.hasClass("hidden")) {
      let exportTooltipWrapper = p5.select("#export-tooltip-wrapper");
      exportTooltipWrapper.addClass("export-tooltip-active");
      floatingMenu.removeClass("hidden");
      floatingMenu.addClass("flex");
    } else {
      closeExportMenu();
    }
  }

  function exportAsPNG() {
    let img = p5.get();
    img.save("state-machine.png");

    closeExportMenu();

    cnvIsFocused = "menu";
  }

  function exportAsJSON() {
    let dmt = p5.createJSONExportObj();

    p5.saveJSON(dmt, "state-machine.json");
    closeExportMenu();

    cnvIsFocused = "menu";
  }

  // JSON functions
  p5.compareJSONObjects = (obj1, obj2) => {
    if (obj1.globalScaleFactor !== obj2.globalScaleFactor) return false;
    if (obj1.states.length !== obj2.states.length || obj1.links.length !== obj2.links.length) return false;

    for (let i = 0; i < obj1.states.length; i++) {
      if (
        obj1.states[i].id !== obj2.states[i].id ||
        obj1.states[i].x !== obj2.states[i].x ||
        obj1.states[i].y !== obj2.states[i].y ||
        obj1.states[i].isStartState !== obj2.states[i].isStartState ||
        obj1.states[i].isEndState !== obj2.states[i].isEndState ||
        obj1.states[i].isRejectState !== obj2.states[i].isRejectState ||
        obj1.states[i].label !== obj2.states[i].label
      )
        return false;
    }

    for (let i = 0; i < obj1.links.length; i++) {
      if (obj1.links[i].isSelfLink !== obj2.links[i].isSelfLink) return false;

      if (!obj1.links[i].isSelfLink) {
        if (obj1.links[i].rules.length !== obj2.links[i].rules.length) return false;

        let comparedRules = obj1.links[i].rules.every(
          (rule, index) => JSON.stringify(rule.label) === JSON.stringify(obj2.links[i].rules[index].label),
        );

        if (
          obj1.links[i].stateA !== obj2.links[i].stateA ||
          obj1.links[i].stateB !== obj2.links[i].stateB ||
          !comparedRules
        )
          return false;

        if (obj1.links[i].hasCircle !== obj2.links[i].hasCircle) return false;

        if (obj1.links[i].hasCircle) {
          if (
            obj1.links[i].startX !== obj2.links[i].startX ||
            obj1.links[i].startY !== obj2.links[i].startY ||
            obj1.links[i].endX !== obj2.links[i].endX ||
            obj1.links[i].endY !== obj2.links[i].endY ||
            obj1.links[i].circleX !== obj2.links[i].circleX ||
            obj1.links[i].circleY !== obj2.links[i].circleY ||
            obj1.links[i].circleR !== obj2.links[i].circleR ||
            obj1.links[i].startAngle !== obj2.links[i].startAngle ||
            obj1.links[i].endAngle !== obj2.links[i].endAngle
          )
            return false;
        } else {
          if (
            obj1.links[i].startX !== obj2.links[i].startX ||
            obj1.links[i].startY !== obj2.links[i].startY ||
            obj1.links[i].endX !== obj2.links[i].endX ||
            obj1.links[i].endY !== obj2.links[i].endY
          )
            return false;
        }
      } else {
        if (obj1.links[i].rules.length !== obj2.links[i].rules.length) return false;

        let comparedRules = obj1.links[i].rules.every(
          (rule, index) => JSON.stringify(rule.label) === JSON.stringify(obj2.links[i].rules[index].label),
        );

        if (
          obj1.links[i].state !== obj2.links[i].state ||
          !comparedRules ||
          obj1.links[i].anchorAngle !== obj2.links[i].anchorAngle
        )
          return false;
      }
    }

    if ((obj1.initialStateLink && !obj2.initialStateLink) || (!obj1.initialStateLink && obj2.initialStateLink))
      return false;

    if (obj1.initialStateLink) {
      if (
        obj1.initialStateLink.state !== obj2.initialStateLink.state ||
        obj1.initialStateLink.deltaX !== obj2.initialStateLink.deltaX ||
        obj1.initialStateLink.deltaY !== obj2.initialStateLink.deltaY
      )
        return false;
    }

    return true;
  };

  p5.createJSONExportObj = () => {
    let dmt = {
      globalScaleFactor: p5.globalScaleFactor,
      states: [],
      links: [],
      initialStateLink: null,
    };

    for (let i = 0; i < states.length; i++) {
      dmt.states.push({
        id: states[i].id,
        x: states[i].x / p5.globalScaleFactor,
        y: states[i].y / p5.globalScaleFactor,
        isStartState: states[i].isStartState,
        isEndState: states[i].isEndState,
        isRejectState: states[i].isRejectState,
        label: states[i].input.input.value(),
      });
    }

    for (let i = 0; i < links.length; i++) {
      if (links[i] instanceof Link) {
        let stuff = links[i].getEndPointsAndCircle();

        dmt.links.push({
          isSelfLink: false,
          stateA: links[i].stateA.id,
          stateB: links[i].stateB.id,
          rules: links[i].transitionBox.rules,
          parallelPart: links[i].parallelPart,
          perpendicularPart: links[i].perpendicularPart,
          lineAngleAdjust: links[i].lineAngleAdjust,
          hasCircle: stuff.hasCircle,
          startX: stuff.startX / p5.globalScaleFactor,
          startY: stuff.startY / p5.globalScaleFactor,
          endX: stuff.endX / p5.globalScaleFactor,
          endY: stuff.endY / p5.globalScaleFactor,
          circleX: stuff.circleX / p5.globalScaleFactor,
          circleY: stuff.circleY / p5.globalScaleFactor,
          circleR: stuff.circleR / p5.globalScaleFactor,
          startAngle: stuff.startAngle,
          endAngle: stuff.endAngle,
        });
      } else if (links[i] instanceof SelfLink) {
        dmt.links.push({
          isSelfLink: true,
          state: links[i].state.id,
          rules: links[i].transitionBox.rules,
          anchorAngle: links[i].anchorAngle,
        });
      }
    }

    if (startLink) {
      dmt.initialStateLink = {
        state: startLink.state.id,
        deltaX: startLink.deltaX,
        deltaY: startLink.deltaY,
      };
    }

    return dmt;
  };

  // Import file
  let inputFile = null;
  let importButton = null;

  function createCanvasStatesFromOBJ(obj) {
    p5.globalScaleFactor = obj.globalScaleFactor;
    if (scalingCanvasSlider) scalingCanvasSlider.value(p5.globalScaleFactor);

    states = [];
    links = [];
    startLink = null;

    for (let i = 0; i < obj.states.length; i++) {
      let state = obj.states[i];
      states.push(new State(p5, state.id, state.x, state.y, stateRadius));
      states[states.length - 1].isStartState = state.isStartState;
      states[states.length - 1].isEndState = state.isEndState;
      states[states.length - 1].isRejectState = state.isRejectState;
      states[states.length - 1].input.input.value(state.label);
      states[states.length - 1].input.textInput(state.label);
    }

    for (let i = 0; i < obj.links.length; i++) {
      let link = obj.links[i];
      if (Number.isInteger(link.stateA) && Number.isInteger(link.stateB)) {
        let stateA = states.find((state) => state.id === link.stateA);
        let stateB = states.find((state) => state.id === link.stateB);
        links.push(
          new Link(p5, stateA, stateB, link.rules, link.parallelPart, link.perpendicularPart, link.lineAngleAdjust),
        );
      } else if (Number.isInteger(link.state)) {
        let state = states.find((state) => state.id === link.state);
        links.push(new SelfLink(p5, state, true, link.rules, link.anchorAngle));
      }
    }

    if (obj.initialStateLink) {
      setInitialState(obj.initialStateLink.state, {
        deltaX: obj.initialStateLink.deltaX,
        deltaY: obj.initialStateLink.deltaY,
      });
      startLink.selected = false;
    }

    return true;
  }

  function handleInputFile(file) {
    if (file.type === "application" && file.subtype === "json") {
      let reader = new FileReader();
      reader.onload = (event) => {
        let result = JSON.parse(event.target.result);

        if (createCanvasStatesFromOBJ(result)) {
          createHistory(p5);
        }
      };
      reader.readAsText(file.file);
    }

    inputFile.value("");
  }

  // Context menu functions
  function closeContextMenuWhenClickngOutside() {
    // Click outside context menu
    if (contextMenu) {
      if (
        p5.mouseX < contextMenu.position().x ||
        p5.mouseX > contextMenu.position().x + contextMenu.width ||
        p5.mouseY < contextMenu.position().y ||
        p5.mouseY > contextMenu.position().y + contextMenu.height
      ) {
        contextMenu.hide();
      }
    }
  }

  // History functions
  p5.history = [];
  p5.maxHistory = 10; // Up to 10 saves
  p5.currentHistoryIndex = 0; // Current index of history

  // Other functions
  function reCalculateCanvasPositions() {
    // Resize canvas
    let canvasContainer = p5.select("#canvas-container");
    let canvasWidth = canvasContainer.elt.offsetWidth;
    let canvasHeight = canvasContainer.elt.offsetHeight;

    if (fs) {
      p5.resizeCanvas(canvasWidth, canvasHeight);
    } else {
      p5.resizeCanvas(canvasWidth, 400);
    }

    // Set window offset
    p5.globalWindowOffset = p5.cnv.position();
  }

  // Main functions
  p5.setup = () => {
    // Create mtDoomWrapper
    createMTDoomWrapper();

    // Create canvas
    p5.cnv = p5.createCanvas(600, 400);
    p5.cnv.parent("canvas-container");
    p5.cnv.elt.addEventListener("contextmenu", (event) => event.preventDefault());
    p5.cnv.mousePressed(mousePressedOnCanvas);
    p5.cnv.mouseReleased(mouseReleasedOnCanvas);
    p5.cnv.mouseMoved(mouseDraggedOnCanvas);
    p5.cnv.doubleClicked(doubleClickOnCanvas);

    // Create bottom menu
    // let bottomDrawer = createBottomDrawer();
    // bottomDrawer.parent("body");

    // Set canvas initial position and size
    reCalculateCanvasPositions();

    // Just for testing
    states.push(new State(p5, states.length, 150 / p5.globalScaleFactor, 200 / p5.globalScaleFactor, stateRadius));
    states.push(new State(p5, states.length, 450 / p5.globalScaleFactor, 200 / p5.globalScaleFactor, stateRadius));

    // Activate default button when starting
    cnvIsFocused = "canvas";
    setSelectedMenuButton("select");

    // Create slider
    scalingCanvasSlider = p5.select("#scalingCanvasSlider");
    contextMenu = createContextMenu();

    // First save on history
    p5.history.push(p5.createJSONExportObj());
  };

  p5.draw = () => {
    let mtDoomWrapper = p5.select("#mt-doom-wrapper");
    let playgroundContainer = p5.select("#playground-container");
    let fullscreenButton = p5.select("#fullscreenButton");

    if (fs) {
      mtDoomWrapper.addClass("min-w-[100vw]");
      mtDoomWrapper.addClass("min-h-[100vh]");
      playgroundContainer.addClass("flex-grow");
      fullscreenButton.html("<span class='material-symbols-outlined' style='font-size: 1.8rem'>fullscreen_exit</span>");
      p5.select("#title").hide();
    } else {
      mtDoomWrapper.removeClass("min-w-[100vw]");
      mtDoomWrapper.removeClass("min-h-[100vh]");
      playgroundContainer.removeClass("flex-grow");
      fullscreenButton.html("<span class='material-symbols-outlined' style='font-size: 1.8rem'>fullscreen</span>");
      p5.select("#title").show();
    }

    // Simulation buttons activation
    simulationButtonActivation();

    // Set properties
    reCalculateCanvasPositions();
    p5.background("#181a1e");

    // Check if canvas is focused
    if (cnvIsFocused === "outside") {
      mtDoomWrapper.removeClass("canvas-focused");
    } else {
      mtDoomWrapper.addClass("canvas-focused");
    }

    // Move canvas
    if (
      p5.mouseIsPressed &&
      ((p5.keyIsDown(p5.CONTROL) && p5.mouseButton === p5.LEFT) ||
        p5.mouseButton === p5.CENTER ||
        p5.selectedLeftSidebarButton === "move")
    ) {
      moveCanvas();
    }

    // Remove links that have no rules
    for (let i = 0; i < links.length; i++) {
      if (!links[i].transitionBox.selected && links[i].transitionBox.rules.length === 0) {
        links[i].transitionBox.remove();
        links.splice(i, 1);
        i--;
      }
    }

    // Set objects hovering
    unHoverAllObjects();
    let hoveredObject = getFirstSelectedObject(p5.mouseX, p5.mouseY, false);
    if (hoveredObject) hoveredObject.object.hovering = hoveredObject.object.containsPoint(p5.mouseX, p5.mouseY);

    // Draw objects in order to create "layers"
    for (let i = 0; i < links.length; i++) {
      links[i].update(p5.globalScaleFactor);
      links[i].draw();
      links[i].transitionBox.update(p5.globalScaleFactor);
      links[i].transitionBox.draw();
    }

    if (startLink) {
      startLink.update(p5.globalScaleFactor);
      startLink.draw();
    }

    for (let i = 0; i < states.length; i++) {
      states[i].update(p5.globalScaleFactor);
      states[i].draw();
    }

    if (currentLink) currentLink.draw();

    // To prevent states from overlapping
    stateRepulse();
  };

  function createLink() {
    if (
      (p5.selectedLeftSidebarButton !== "select" && p5.selectedLeftSidebarButton !== "addLink") ||
      links.some((link) => link.transitionBox.selected)
    )
      return;

    let hoveredObject = getFirstSelectedObject(p5.mouseX, p5.mouseY, false);

    if ((hoveredObject && hoveredObject.object instanceof State) || !hoveredObject) {
      if (
        hoveredObject &&
        !(currentLink instanceof TemporaryLink && lastSelectedState !== states[hoveredObject.index])
      ) {
        currentLink = new SelfLink(p5, states[hoveredObject.index]);
        lastSelectedState = states[hoveredObject.index];
      } else {
        if (lastSelectedState) {
          if (currentLink instanceof SelfLink && !currentLink.from) {
            currentLink = new TemporaryLink(p5);
            currentLink.from = lastSelectedState.closestPointOnCircle(p5.mouseX, p5.mouseY);
          }
        } else {
          if (!currentLink || !currentLink.from) {
            currentLink = new TemporaryLink(p5);
            currentLink.from = { x: p5.mouseX, y: p5.mouseY };
          }
        }
      }
    } else {
      if (currentLink instanceof SelfLink) {
        currentLink = new TemporaryLink(p5);
        currentLink.from = lastSelectedState.closestPointOnCircle(p5.mouseX, p5.mouseY);
      }
    }

    if (currentLink instanceof TemporaryLink) {
      currentLink.to = { x: p5.mouseX, y: p5.mouseY };

      if (
        hoveredObject &&
        hoveredObject.object instanceof State &&
        lastSelectedState &&
        states[hoveredObject.index].id !== lastSelectedState.id
      ) {
        currentLink.to = states[hoveredObject.index].closestPointOnCircle(lastSelectedState.x, lastSelectedState.y);
      } else if (lastSelectedState) {
        currentLink.from = lastSelectedState.closestPointOnCircle(p5.mouseX, p5.mouseY);
      } else if (hoveredObject && hoveredObject.object instanceof State && !lastSelectedState) {
        currentLink.to = states[hoveredObject.index].closestPointOnCircle(currentLink.from.x, currentLink.from.y);
      }
    }
  }

  function setInitialState(index = null, props = null) {
    let linkSize = 80 * p5.globalScaleFactor;

    if (index === null) {
      if (p5.selectedObject && p5.selectedObject.object instanceof State) {
        let start = {
          x: p5.selectedObject.object.x - linkSize,
          y: p5.selectedObject.object.y,
        };
        startLink = new StartLink(p5, p5.selectedObject.object, start);
        startLink.selected = true;

        // Unset the start state for all states
        for (let i = 0; i < states.length; i++) {
          p5.selectedObject.object.isStartState = false;
        }

        // Set the selected state as the start state
        p5.selectedObject.object.isStartState = true;
        cnvIsFocused = "export-menu";
      }
    } else {
      let start = { x: states[index].x - linkSize, y: states[index].y };

      // Modify the starting position if props are provided
      if (props) {
        start = {
          x: states[index].x + props.deltaX,
          y: states[index].y + props.deltaY,
        };
      }

      // Create a new StartLink for the specified state
      startLink = new StartLink(p5, states[index], start);
      startLink.selected = true;

      // Unset the start state for all states
      for (let i = 0; i < states.length; i++) {
        states[i].isStartState = false;
      }

      // Set the specified state as the start state
      states[index].isStartState = true;
    }

    // Hide the context menu
    contextMenu.hide();
  }

  function toggleFinalState() {
    cnvIsFocused = "export-menu";

    if (p5.selectedObject && p5.selectedObject.object instanceof State) {
      p5.selectedObject.object.isEndState = !p5.selectedObject.object.isEndState;
    }

    contextMenu.hide();
  }

  function renameState() {
    cnvIsFocused = "export-menu";

    if (p5.selectedObject && p5.selectedObject.object instanceof State) {
      p5.selectedObject.object.input.visible = true;
    }

    contextMenu.hide();
  }

  function deleteObject() {
    if (p5.selectedObject) {
      if (p5.selectedObject.object instanceof State) {
        for (let i = 0; i < links.length; i++) {
          if (links[i] instanceof Link) {
            if (
              links[i].stateA.id === p5.selectedObject.object.id ||
              links[i].stateB.id === p5.selectedObject.object.id
            ) {
              links[i].transitionBox.remove();
              links.splice(i, 1);
              i--;
            }
          } else {
            if (links[i].state.id === p5.selectedObject.object.id) {
              links[i].transitionBox.remove();
              links.splice(i, 1);
              i--;
            }
          }
        }

        if (startLink && startLink.state.id === p5.selectedObject.object.id) startLink = null;

        p5.selectedObject.object.remove();
        states.splice(p5.selectedObject.index, 1);
      } else if (p5.selectedObject.object instanceof Link || p5.selectedObject.object instanceof SelfLink) {
        p5.selectedObject.object.transitionBox.remove();
        links.splice(p5.selectedObject.index, 1);
      } else if (p5.selectedObject.object instanceof StartLink) {
        startLink = null;
      }

      p5.selectedObject = null;
      createHistory(p5);
    }
  }

  function getNewStateId() {
    let maxId = 0;
    for (let i = 0; i < states.length; i++) {
      if (states[i].id > maxId) maxId = states[i].id;
    }

    return maxId + 1;
  }

  function stateRepulse(repulseFactor = 2 * stateRadius + 2) {
    repulseFactor *= p5.globalScaleFactor;

    for (let i = 0; i < states.length; i++) {
      for (let j = 0; j < states.length - 1; j++) {
        if (i == j) continue;
        let distance = p5.dist(states[i].x, states[i].y, states[j].x, states[j].y);
        if (distance < repulseFactor) {
          let angle = atan2(states[j].y - states[i].y, states[j].x - states[i].x);
          let pushX = cos(angle) * 5;
          let pushY = sin(angle) * 5;
          states[i].x -= pushX;
          states[i].y -= pushY;
          states[j].x += pushX;
          states[j].y += pushY;
        }
      }
    }
  }

  function checkAnyStateInputVisible() {
    return states.some((state) => state.input.visible);
  }

  function unHoverAllObjects() {
    states.forEach((state) => (state.hovering = false));
    links.forEach((link) => {
      link.hovering = false;
      link.transitionBox.hovering = false;
    });
    if (startLink) startLink.hovering = false;
  }

  function unSelectAllObjects() {
    states.forEach((state) => (state.selected = false));
    links.forEach((link) => {
      link.selected = false;
      link.transitionBox.selected = false;
    });
    if (startLink) startLink.selected = false;
  }

  function getFirstSelectedObject(x = p5.mouseX, y = p5.mouseY, uncheckObjects = true) {
    if (uncheckObjects) unSelectAllObjects();

    for (let i = states.length - 1; i >= 0; i--) {
      if (states[i].containsPoint(x, y)) return { object: states[i], index: i };
    }

    if (startLink && startLink.containsPoint(x, y)) return { object: startLink, index: -1 };

    for (let i = links.length - 1; i >= 0; i--) {
      if (links[i].containsPoint(x, y)) return { object: links[i], index: i };
    }

    return null;
  }

  function moveCanvas(x = p5.mouseX, y = p5.mouseY) {
    if (cnvIsFocused === "outside") return;

    const ratioFactor = 3;
    p5.movingCanvasOffset.x = (p5.movingCanvasOffset.x - (x - p5.pmouseX)) / ratioFactor;
    p5.movingCanvasOffset.y = (p5.movingCanvasOffset.y - (y - p5.pmouseY)) / ratioFactor;
  }

  function mousePressedOnCanvas() {
    closeBottomDrawer();
    if (cnvIsFocused === "outside") return;

    closeExportMenu();
    closeContextMenuWhenClickngOutside();

    if (
      p5.mouseButton === p5.CENTER ||
      p5.keyIsDown(p5.SHIFT) ||
      p5.keyIsDown(p5.CONTROL) ||
      p5.selectedLeftSidebarButton === "move"
    )
      return;

    p5.selectedObject = getFirstSelectedObject();
    if (p5.selectedObject) p5.selectedObject.object.selected = true;

    if (p5.mouseButton === p5.LEFT) {
      // Add State on Click Canvas
      if (p5.selectedLeftSidebarButton === "addState" && !p5.selectedObject) {
        if (checkAnyStateInputVisible()) createHistory(p5);
        unSelectAllObjects();

        // Check if mouse is over a link transition box
        if (links.some((link) => link.transitionBox.containsPoint(p5.mouseX, p5.mouseY))) return;

        // Create new state
        let stateID = getNewStateId();
        states.push(
          new State(p5, stateID, p5.mouseX / p5.globalScaleFactor, p5.mouseY / p5.globalScaleFactor, stateRadius),
        );
        states[states.length - 1].selected = true;
        p5.selectedObject = {
          object: states[states.length - 1],
          index: states.length - 1,
        };

        createHistory(p5);
        return;
      }

      // Delete Object on Click Canvas
      if (p5.selectedLeftSidebarButton === "delete") {
        if (checkAnyStateInputVisible()) createHistory(p5);

        deleteObject();
      }

      states.forEach((state) => {
        state.mousePressed();
      });

      links.forEach((link) => {
        link.transitionBox.mousePressed();
      });
    } else if (p5.mouseButton === p5.RIGHT) {
      if (p5.selectedObject && p5.selectedObject.object instanceof State) {
        contextMenu.position(
          p5.globalWindowOffset.x + p5.selectedObject.object.x,
          p5.globalWindowOffset.y + p5.selectedObject.object.y,
        );

        if (p5.selectedObject.object.isEndState) {
          p5.select("#set-final-state").html("Definir como Não Final");
        } else {
          p5.select("#set-final-state").html("Definir como Final");
        }

        contextMenu.show();
      }
    }

    return false;
  }

  function mouseReleasedOnCanvas() {
    p5.movingCanvasOffset.x = 0;
    p5.movingCanvasOffset.y = 0;

    if (currentLink instanceof TemporaryLink) {
      if (currentLink.from && currentLink.to) {
        let hoveredObject = getFirstSelectedObject();

        if (hoveredObject && hoveredObject.object instanceof State) {
          // Check if the link is coming from another state
          if (lastSelectedState && lastSelectedState instanceof State) {
            let from = lastSelectedState;
            let to = hoveredObject.object.id !== lastSelectedState.id ? hoveredObject.object : null;

            if (
              from &&
              to &&
              !links.some((link) => link instanceof Link && link.stateA.id === from.id && link.stateB.id === to.id)
            ) {
              links.push(new Link(p5, from, to));
              links[links.length - 1].transitionBox.selected = true;

              // Extra: if already exists a link to -> from, turn links curved
              if (
                links.some((link) => link instanceof Link && link.stateA.id === to.id && link.stateB.id === from.id)
              ) {
                let link = links.find(
                  (link) => link instanceof Link && link.stateA.id === to.id && link.stateB.id === from.id,
                );
                if (link) {
                  if (link.perpendicularPart === 0) {
                    link.perpendicularPart = 10;
                    links[links.length - 1].perpendicularPart = 10;
                  }
                }
              }
            } else {
              let link = links.find(
                (link) => link instanceof Link && link.stateA.id === from.id && link.stateB.id === to.id,
              );
              if (link) {
                link.transitionBox.selected = true;
                console.log("Link already exists");
              }
            }
          } else {
            startLink = new StartLink(p5, hoveredObject.object, currentLink.from);
            startLink.selected = true;

            for (let i = 0; i < states.length; i++) states[i].isStartState = false;
            hoveredObject.object.isStartState = true;

            createHistory(p5);
          }
        } else {
          hoveredObject = null;
          p5.selectedObject = null;
          lastSelectedState = null;
          currentLink = null;
        }
      }
    } else if (currentLink instanceof SelfLink) {
      unSelectAllObjects();

      // Check if already exists a link to itself
      if (!links.some((link) => link instanceof SelfLink && link.state.id === lastSelectedState.id)) {
        links.push(new SelfLink(p5, currentLink.state, true));
        links[links.length - 1].transitionBox.selected = true;
      } else {
        let link = links.find((link) => link instanceof SelfLink && link.state.id === lastSelectedState.id);
        if (link) {
          console.log("SelfLink already exists");
          link.transitionBox.selected = true;
        }
      }
    }

    currentLink = null;
    lastSelectedState = null;

    if (startLink) startLink.mouseReleased();

    links.forEach((link) => {
      link.mouseReleased();
    });

    states.forEach((state) => {
      state.mouseReleased();
    });

    return false;
  }

  function mouseDraggedOnCanvas() {
    if (!p5.mouseIsPressed || p5.mouseButton !== p5.LEFT || cnvIsFocused === "outside") return false;

    links.forEach((link) => {
      link.mouseDragged();
    });

    if (p5.keyIsDown(p5.SHIFT) || p5.selectedLeftSidebarButton === "addLink") createLink();

    if (startLink) startLink.mouseDragged();

    return false;
  }

  function doubleClickOnCanvas() {
    let hoveredObject = getFirstSelectedObject(p5.mouseX, p5.mouseY, false);

    links.forEach((link) => {
      link.transitionBox.doubleClick();
      link.doubleClick();
    });

    if (links.some((link) => link.transitionBox.containsPoint(p5.mouseX, p5.mouseY) && link.transitionBox.selected))
      return;

    if (p5.selectedLeftSidebarButton === "select") {
      if (!hoveredObject) {
        console.log("Double clicked on empty space");
        let stateID = getNewStateId();
        states.push(
          new State(p5, stateID, p5.mouseX / p5.globalScaleFactor, p5.mouseY / p5.globalScaleFactor, stateRadius),
        );
        states[states.length - 1].selected = true;
        p5.selectedObject = {
          object: states[states.length - 1],
          index: states.length - 1,
        };

        createHistory(p5);
      } else {
        if (hoveredObject.object instanceof State) {
          console.log("Double clicked on state");
          contextMenu.position(
            p5.globalWindowOffset.x + hoveredObject.object.x,
            p5.globalWindowOffset.y + hoveredObject.object.y,
          );

          if (hoveredObject.object.isEndState) {
            p5.select("#set-final-state").html("Definir como Não Final");
          } else {
            p5.select("#set-final-state").html("Definir como Final");
          }

          contextMenu.show();
        }
      }
    }

    return false;
  }

  // General mouse functions
  p5.mousePressed = () => {
    if (
      (p5.mouseX >= 0 && p5.mouseX <= p5.width && p5.mouseY >= 0 && p5.mouseY <= p5.height) ||
      cnvIsFocused === "menu" ||
      cnvIsFocused === "export-menu"
    ) {
      // Click happened inside the canvas
      if (!p5.selectedLeftSidebarButton && cnvIsFocused !== "export-menu") setSelectedMenuButton("select");

      cnvIsFocused = "canvas";
      p5.cnv?.elt.focus();
    } else {
      // Click happened outside the canvas
      unHoverAllObjects();
      unSelectAllObjects();
      mouseReleasedOnCanvas();
      setSelectedMenuButton(null);
      closeContextMenuWhenClickngOutside();
      closeExportMenu();
      cnvIsFocused = "outside";
      p5.selectedObject = null;

      // Hide all states inputs
      closeFloatingCanvasMenus();

      // Unselect all transition boxes
      for (let i = 0; i < links.length; i++) {
        links[i].transitionBox.selected = false;
        links[i].transitionBox.selectedRuleIndex = -1;
      }
    }

    // return false;
  };

  p5.mouseReleased = () => {
    if (cnvIsFocused === "outside") return false;
    if (!links.some((link) => link.transitionBox.selected)) {
      mouseReleasedOnCanvas();
    }

    return false;
  };

  p5.mouseMoved = () => {
    if (p5.mouseX < 0 || p5.mouseX > p5.width || p5.mouseY < 0 || p5.mouseY > p5.height) {
      mouseReleasedOnCanvas();
    }

    return false;
  };

  p5.mouseWheel = (event) => {
    if (cnvIsFocused === "outside") return false;

    if (event.delta > 0) {
      p5.globalScaleFactor = Math.max(p5.globalScaleFactor - 0.25, 0.5);
      // scalingCanvasSlider.value(globalScaleFactor);
    } else {
      p5.globalScaleFactor = Math.min(p5.globalScaleFactor + 0.25, 2.0);
      // scalingCanvasSlider.value(globalScaleFactor);
    }

    return false;
  };

  // Keyboard functions
  p5.keyPressed = () => {
    // if (cnvIsFocused === "outside") return false;

    if (
      (p5.keyCode === 49 || p5.keyCode === 50 || p5.keyCode === 51 || p5.keyCode === 52 || p5.keyCode === 53) &&
      !p5.keyIsDown(p5.SHIFT) &&
      !states.some((state) => state.input.visible) &&
      !links.some((link) => link.transitionBox.selected) &&
      !p5.select("#lab-test").hasClass("active")
    ) {
      let index = p5.keyCode - 49;
      let buttons = ["select", "move", "addState", "addLink", "delete"];
      setSelectedMenuButton(buttons[index]);
      // return false;
    }

    if (p5.keyCode === p5.DELETE) deleteObject();

    states.forEach((state) => {
      state.keyPressed();
    });

    links.forEach((link) => {
      link.transitionBox.keyPressed();
    });

    // Check ctrl + z
    if (p5.keyIsDown(p5.CONTROL) && (p5.key === "z" || p5.key === "Z")) {
      let newIndex = Math.max(p5.currentHistoryIndex - 1, 0);

      if (newIndex !== p5.currentHistoryIndex) {
        p5.currentHistoryIndex = newIndex;
        createCanvasStatesFromOBJ(p5.history[p5.currentHistoryIndex]);
      }
    }

    // Check ctrl + y
    if (p5.keyIsDown(p5.CONTROL) && (p5.key === "y" || p5.key === "Y")) {
      let newIndex = Math.min(p5.currentHistoryIndex + 1, p5.history.length - 1);

      if (newIndex !== p5.currentHistoryIndex) {
        p5.currentHistoryIndex = newIndex;
        createCanvasStatesFromOBJ(p5.history[p5.currentHistoryIndex]);
      }
    }

    // return false;
  };

  p5.keyReleased = () => {
    if (p5.keyCode === p5.SHIFT && p5.selectedLeftSidebarButton !== "addLink") {
      currentLink = null;
    } else if (p5.keyCode === p5.CONTROL) {
      p5.movingCanvasOffset.x = 0;
      p5.movingCanvasOffset.y = 0;
    }

    // return false;
  };
};
