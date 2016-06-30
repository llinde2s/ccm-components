/**
 * Created by Leonard on 01.06.2016.
 */
/* Nach Chat und teilweise Rating vorlage
* Benutzbar für sequentielles Voting, wie z.B. Abstimmung, Wahl, etc.
* */
ccm.component( {

    name: 'KommentarBox',
    config: {
        html: [ ccm.store, { local: 'template.json' } ],
        key:   'ktb',
        //store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'ktstoreb' } ],
        store: [ ccm.store, 'template.json' ],
        style: [ ccm.load, 'style.css' ],
        user:  [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js' ]
    },

    Instance: function () {

        var self = this;

        self.init = function ( callback ) {

            self.store.onChange = function () { self.render(); };

            callback();

        };

        this.ready = function ( callback ) {

            if ( self.user ) self.user.addObserver( function () { self.render(); } );
            callback();

        };





        self.render = function ( callback ) {

            var element = ccm.helper.element( self );



            self.store.get( self.key, function ( dataset ) {

                if ( dataset === null )
                    self.store.set( { key: self.key, messages: [] }, proceed );
                else
                    proceed( dataset );

                function proceed( dataset ) {

                    element.html( ccm.helper.html( self.html.get( 'main' ) ) );

                    var messages_div = ccm.helper.find( self, '.messages' );


                    for ( var i = 0; i < dataset.messages.length; i++ ) {

                        var message = dataset.messages[i];

                        if(message.likes===undefined)
                        {
                            message.likes = 0;
                        }

                        if(message.dislikes===undefined)
                        {
                            message.dislikes = 0;
                        }
                        if (dataset.likes === undefined) {
                            dataset.likes = 0;


                        }
                        if (dataset.dislikes === undefined) {
                            dataset.dislikes = 0;

                        }

                        if(message.rating ===undefined)
                        {
                            message.rating = 0;
                        }

                        /*if(message.number ===undefined)
                        {
                            message.number = i;
                        }*/


                        messages_div.append(ccm.helper.html(self.html.get('message'), {


                            name: ccm.helper.val(message.user),
                            text: ccm.helper.val(message.text),
                            likes: ccm.helper.val(message.likes),
                            dislikes: ccm.helper.val(message.dislikes),
                            rating: ccm.helper.val(message.rating),
                            //number: ccm.helper.val(message.number),
                            colorstyle:ccm.helper.val(message.colorstyle),




                            clicklike:function(){
                                //dataset.number++;
                                //alert(dataset.messages[number].number);
                                //dataset.messages[number-1].likes++; //Message, zu der der Likebutton gehört
                                message.likes++;
                                message.rating++;
                                if(message.rating>0)message.colorstyle="green";
                                if(message.rating===0)message.colorstyle="black";

                                //dataset.messages.pop();
                                //dataset.messages.push( { user: self.user.data().key,name:ccm.helper.val(message.user),text:ccm.helper.val(message.text),likes: ccm.helper.val(savelike)} );
                                self.store.set( dataset, function () { self.render(); } );


                            },
                            clickdislike:function(){
                                //dataset.dislikes--;
                                message.dislikes++;
                                message.rating--;
                                if(message.rating<0)message.colorstyle="red";
                                if(message.rating===0)message.colorstyle="black";
                                self.store.set( dataset, function () { self.render(); } );
                                
                            }

                        }));



                        var div = {
                            likes: ccm.helper.find(self, messages_div, 'likebutton'),
                            dislikes: ccm.helper.find(self, messages_div, 'dislikebutton')
                        };

                    }



                        function clickchoose(index)
                        {
                            if(index === div[index])
                            {
                                alert('hey its me');
                            }
                            alert(index + "inclickchoose");
                            if(index===likebutton)
                            {
                                alert(index + "inif");
                                clicklike(index);
                            }
                            else
                            {
                                alert(index);
                                clickDislike(index);
                            }
                        }

                        function clicklike(likes) {
                            alert(likes+"inclicklike");
                            likes.dataset.likes++;
                            div[likes].click(function () {

                                dataset.likes++;
                            });
                            self.store.set(dataset.likes, function () {
                                self.render();
                            });
                        }

                        function clickdislike(dislikes) {
                            alert(dislikes);
                            div[dislikes].click(function () {
                                dataset.dislikes++;
                            });
                            self.store.set(dataset.dislikes, function () {
                                self.render();
                            });
                        }




                    messages_div.append( ccm.helper.html( self.html.get( 'input' ), { onsubmit: function () {

                        var value = ccm.helper.val( ccm.helper.find( self, 'input' ).val() ).trim();

                        if ( value === '' ) return false;

                        self.user.login( function () {

                            dataset.messages.push( { user: self.user.data().key, text: value } );

                            self.store.set( dataset, function () { self.render(); } );

                        } );

                        return false;

                    } } ) );

                    if ( callback ) callback();



                }

            } );



        };



    }

} );