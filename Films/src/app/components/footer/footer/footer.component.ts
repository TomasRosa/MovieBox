import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  showIgBubbles = false;
  showLinkedinBubbles = false;
  showGitHubBubbles = false;

  toggleIgBubbles() {
    this.showIgBubbles = !this.showIgBubbles;
    if (this.showIgBubbles) {
      this.showLinkedinBubbles = false; 
      this.showGitHubBubbles = false;
    }
  }

  toggleGitHubBubbles(){
    this.showGitHubBubbles = !this.showGitHubBubbles
    if (this.showGitHubBubbles){
      this.showLinkedinBubbles = false;
      this.showIgBubbles = false;
    }
  }

  toggleLinkedinBubbles() {
    this.showLinkedinBubbles = !this.showLinkedinBubbles;
    if (this.showLinkedinBubbles) {
      this.showIgBubbles = false; 
      this.showGitHubBubbles = false;
    }
  }

  hideBubbles() {
    this.showIgBubbles = false;
    this.showLinkedinBubbles = false;
  }
}
