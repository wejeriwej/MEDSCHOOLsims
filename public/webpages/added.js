class SpecialHeader extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `













        <div id = "headerplacement">
          
        <nav class="nav-area">
          <div id="topbanner"></div>
          
                    <div class="logoplacement">
                    <a href="../index.html">
                        <input type="image" id="logo" rel="preload" src="../art/logoupdated1.webp" name="saveForm" class="btTxt submit" id="saveForm" />
                    </a>
                </div>
          
          
          <ul id = "navigationtings">
            
           
            
            <li class = "homebtn" id="r1">
              <a href="../index.html">home</a>
            </li>
            
        
        
        
        
            <li class = "secondheaderbtn" id="r1s">
              
              <a href="searchbarr.html" style="border-bottom-left-radius: 0%; border-bottom-right-radius: 0%;">Cases by Topic ᵕ</a>
              <ul id = "casebytopiclayout">
                
              <li>
                  <a href="searchbarr.html" style="border-radius: 0%; border-radius: 0%;">All cases</a>

                </li>
                <li>
                  <a href="../searchtopics/cardio.html" style="border-radius: 0%; border-radius: 0%;">Cardiology</a>
                  
                </li>
                <li>
                  <a href="../searchtopics/resp.html" style="border-radius: 0%;">Respiratory</a>
                </li>
        
                <li>
                  <a href="../searchtopics/gensurg.html" style="border-radius: 0%;">General surgery</a>
                </li>
        
                <li>
                <a href="../searchtopics/neurology.html" style="border-radius: 0%;">Neurology</a>
                </li>
    <!--    
                <li>
                <a href="#" style="border-radius: 0%;">Paediatrics</a>
                </li>
        
                <li>
                <a href="#" style="border-radius: 0%;">ENT</a>
                </li>
        
                <li>
                <a href="#" style="border-radius: 0%;">Opthalm</a>
                </li>
        
                <li>
                <a href="#" style="border-radius: 0%;">Derm</a>
                </li>
        
                <li>
                <a href="#" style="border-radius: 0%;">Rheum</a>
                </li>
        
                <li>
                  <a href="#" style="border-radius: 0%;">Obs + Gynae</a>
        
                </li>
                
                <li>
                  <a href="#" style="border-radius: 0%;">Orthopaedics</a>
                </li>
  -->
              </ul>
            </li>
            
            <li class = "thirdheaderbtn" id="r1">
              <a href="aboutus.html" >About us</a>
            </li>
            
        
            <li class = "fourthheaderbtn" id="r1">
              <a href="contactus.html" >Contact us</a>
            </li>
          
        
            
            
        
        
            <li class = "loginbtn">
              <a href="#" >Login</a>
            </li>
            
            <li class = "searchbtn">
              <a href="searchbarr.html" style="font-size: 30px; margin-top: -13px;" >⌕</a>
            </li>
        
                  
            
            <li class="mobilenavarea"><a href="javascript:void(0);" class="icon" onclick="myFunction()">
              <i class="fa fa-bars"></i>
            </a>
          </li>
        



        
            <div id="myLinks" style="display: none;">
    <a href="index.html">Home</a>
    <a href="webpages/aboutus.html">About us</a>
    <a href="webpages/contactus.html">Contact us</a>
    <a href="webpages/searchbarr.html">Cases by topic</a>
    
</div>
            
            
          </ul>
        </center>
        
        </div>
                <div id="bottombanner"></div>
        
        </nav>












        
        `
    }
}






 


class OtherCases extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `

        <center><h2 style="font-family: LTSoul;">Other cases:</h2></center>
        <div class="scroll-container">
              <div class="image-container">
                <img src="../pics/1stcase.webp" onclick="window.location.href='../page1.html';" alt="Cinque Terre" width="600" height="400">
                <div class="image-caption" onclick="window.location.href='page1.html';" style="cursor: pointer;">Chest pain</div>            
            </div>

            <div class="image-container">
                <img src="../pics/2ndcase.webp" onclick="window.location.href='../OTHERCASES/2ndcase/page1.html';" alt="Forest" width="600" height="400">
                <div class="image-caption" onclick="window.location.href='OTHERCASES/2ndcase/page1.html';" style="cursor: pointer;">Abdo pain</div>            
            </div>

            <div class="image-container">
                <img src="../pics/3rdcase.webp" onclick="window.location.href='../OTHERCASES/3rdcase/page1.html';" alt="Northern Lights" width="600" height="400">
                <div class="image-caption" onclick="window.location.href='OTHERCASES/3rdcase/page1.html';" style="cursor: pointer;">Cough</div>            
            </div>

            <div class="image-container">
                <img src="../pics/4thcase.webp" onclick="window.location.href='../OTHERCASES/4thcase/page1.html';" alt="Mountains" width="600" height="400">
                <div class="image-caption" onclick="window.location.href='OTHERCASES/4thcase/page1.html';" style="cursor: pointer;">Limb weakness</div>            
            </div>
        </div>

        
        `
    }
}







class SpecialFooter extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `

        <footer>
        <a href="mailto:oscesims@gmail.com">oscesims@gmail.com</a></p>
<br>
<p>Medical Disclaimer:<br>
The information provided on OSCE Sims is for educational and informational purposes only and is intended to support medical students in their exam preparation. It does not constitute medical advice, diagnosis, or treatment.

While we strive to ensure that the content is accurate and up to date, we make no guarantees regarding its completeness, reliability, or accuracy. Medical knowledge is constantly evolving, and guidelines may change over time.

If you have a medical concern, please seek advice from a qualified healthcare professional. Do not rely on the information on this website as a substitute for professional medical judgment, diagnosis, or treatment.
<br><br>
By using this website, you acknowledge and agree that:

OSCE Sims and its creators are not responsible or liable for any harm, loss, or damages resulting from the use or misuse of the information provided.
The website is not a replacement for clinical training, professional supervision, or real-world experience.
Any actions taken based on the information found here are at your own risk.
If you do not agree with these terms, please refrain from using this website.</p><br>
        
        🍉اللهُمَّ إِنَّهُمْ مَغْلُوبُونَ فَانْتَصِرْ لَهُمْ. <!--O Allah! They are helpless, so help them.-->

      </footer>

        
        `
    }
}







customElements.define('special-header', SpecialHeader)
customElements.define('other-cases', OtherCases)
customElements.define('special-footer', SpecialFooter)




