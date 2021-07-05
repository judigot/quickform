<?php require_once 'Imports/preload.php'; ?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <?php require_once 'Imports/top.php'; ?>
        <link href="Assets/css/grayscale.css" rel="stylesheet" type="text/css"/>
        <script src="Assets/js/grayscale.js" type="text/javascript"></script>
    </head>

    <body id="page-top" data-spy="scroll" data-target=".navbar-fixed-top">

        <!-- Navigation -->
        <nav class="navbar navbar-custom navbar-fixed-top" role="navigation">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand page-scroll" href="#page-top">
                        Quick<span class="light partial">Form</span>
<!--                        <img class="quickform-nav" src="Assets/images/quickhome.png" alt="Mountain View">-->
                    </a>
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-main-collapse">
                        <i class="fa fa-bars"></i>
                    </button>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse navbar-right navbar-main-collapse">
                    <ul class="nav navbar-nav">
                        <!-- Hidden li included to remove active class from about link when scrolled up past about section -->
                        <li class="hidden">
                            <a href="#page-top"></a>
                        </li>
                        <li>
                            <a class="page-scroll" href="#getstarted">Get Started!</a>
                        </li>
                        <li>
                            <a class="page-scroll" href="#about">About</a>
                        </li>
                        <li>
                            <a class="page-scroll" href="#contact">Contact</a>
                        </li>
                    </ul>
                </div>
                <!-- /.navbar-collapse -->
            </div>
            <!-- /.container -->
        </nav>

        <!-- Intro Header -->
        <header class="intro">
            <div class="intro-body">
                <div class="container">
                    <div class="row">
                        <br><br><br>
                        <div class="col-md-8 col-md-offset-2" id="intro-container">
                            <img class="quickform" src="Assets/images/quickhome.png" alt="Mountain View">
                            <!--<h1 class="brand-heading">Quick<span class="brand-heading partial">form</span></h1>-->
                            <br><br>
                            <p class="intro-text">Customizable Attendance-Monitoring System</p>
                        </div>
                    </div>
                </div>
                <a href="#getstarted" class="btn btn-circle page-scroll">
                    <i class="fa fa-angle-double-down animated"></i>
                </a>
            </div>
        </header>

        <!-- Get Started Section -->
        <section id="getstarted" class="content-section text-center">
            <div class="getstarted-section quicksection">
                <div class="container">
                    <div class="col-lg-8 col-lg-offset-2">
                        <h2>Get Started with Quickform</h2>
                        <p>Start organizing events and collaborate with others!</p>
                        <a href="login" class="btn btn-default btn-lg getStarted">Log in</a>
                        <a href="signup" class="btn btn-default btn-lg getStarted">Sign up</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="content-section text-center">
            <div class="about-section quicksection">
                <div class="container">
                    <div class="col-lg-8 col-lg-offset-2">
                        <h2>About Quickform</h2>
                        <p>Quickform is a free-to-use web-based application aiming to simplify the organization of medium to large scale events, and to simplify the taking of attendance during said events.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="content-section text-center">
            <div class="contact-section quicksection">
                <div class="container">
                    <div class="col-lg-8 col-lg-offset-2">
                        <h2>Contact Us</h2>
                        <p>If you have any questions or suggestions feel free to email us.</p>
                        <p>
                            <!--http://bit.ly/2Bm7XYe-->
                            <a href="">steventantalizer@gmail.com</a><br>
                            <a href="">chanzcañete@gmail.com</a><br>
                            <a href="">ticod41@gmail.com</a><br>
                            <a href="">judigot@gmail.com</a>
                        </p>
                        <ul class="list-inline banner-social-buttons">
                            <li>
                                <a href="" class="btn btn-default btn-lg"><i class="fa fa-facebook fa-fw"></i> <span class="network-name">Facebook</span></a>
                            </li>
                            <li>
                                <a href="" class="btn btn-default btn-lg"><i class="fa fa-twitter fa-fw"></i> <span class="network-name">Twitter</span></a>
                            </li>
                            <li>
                                <a href="" class="btn btn-default btn-lg"><i class="fa fa-google-plus fa-fw"></i> <span class="network-name">Google+</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer id="quickFooter">
            <div id="quickFooter">
                <div class="footer-container">
                    <span class="footer-title">About Quickform</span>
                    <a href="#" class="footer-item">Tutorials</a>
                    <a href="#" class="footer-item">Using Quickform</a>
                </div>
                <div class="footer-container">
                    <span class="footer-title">Support</span>
                    <a href="#" class="footer-item">FAQ'S</a>
                    <a href="#" class="footer-item">Donate</a>
                </div>
                <div class="footer-container">
                    <span class="footer-title">Contact Us</span>
                    <a href="#" class="footer-item">quickformteam@gmail.com</a>
                    <a href="#" class="footer-item">&nbsp;</a>
                </div>
                <hr>
                <p class="footer-item site-info">Copyright &copy; <?php echo date("Y"); ?> Quickform Inc. All rights reserved.</p>
            </div>
        </footer>
        <?php require_once 'Imports/bottom.php'; ?>
    </body>

</html>