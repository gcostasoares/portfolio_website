import { handleFormSubmission } from './elements/js/form.js';
import { initializeHeaderAndNavigation } from './elements/js/header.js';
import { movingText } from "./elements/js/movingText.js";
import { handleScroll, handleBurgerMenu, handleTextSize, handleAnimation } from './elements/js/perpectiveText.js';

handleScroll();
handleBurgerMenu();
handleTextSize();
handleAnimation();

movingText();
initializeHeaderAndNavigation();
handleFormSubmission();
