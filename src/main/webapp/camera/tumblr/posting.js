(function (b, a) {
    Tumblr.PostForms.Note = Tumblr.PostForms.BaseView.extend({
        events: function () {
            return _.defaults({
                "click .editor_button.photo": "__image_upload",
                "click .file_upload_overlay .cancel": "dismiss_file_upload_overlay"
            }, Tumblr.PostForms.BaseView.prototype.events)
        },
        initialize: function () {
            this.post = this.model.get("post");
            this.editor_id = this.post.is_reblog ? "post_three" : "post_two";
            this.constructor.__super__.initialize.call(this, this.options);
            this.$original_sub_template = b("#note_original_subtemplate").html();
            this.$reblog_sub_template = b("#note_reblog_subtemplate").html();
            this.$upload_list_template = b("#upload_list_subtemplate").html();
            this.model.on("change:upload_progress", this.upload_progress, this);
            this.model.on("change:upload_complete", this.upload_complete, this);
            this.model.on("change:upload_file_error", this.file_errors, this);
            this.model.on("change:upload_failed", this.upload_failed, this);
            this.model.on("change:send_file", this.display_file_list, this);
            this.$post_form.on("click", "#file_list .cancel", _.bind(this.dismiss_upload, this))
        },
        render_editor: function () {
            var c = b.extend({}, Tumblr.PostForms.editor_defaults, {
                layout: "bold,italic,strikethrough,link,unlink,numlist,bullist,image,image_upload,blockquote,spellchecker,code",
                plugins: "spellchecker,autoresize,safari,ajax_forms,image_upload,tumblr_popovers",
                focus: (this.model.get("edit") || this.model.get("reblog")) ? "focus_end" : true,
                type: this.editor_type
            });
            Tumblr.Editor.render(this.editor_id, c)
        },
        render_view: function (d) {
            if (this.post.is_reblog) {
                var c = _.template(this.$reblog_sub_template)
            } else {
                var c = _.template(this.$original_sub_template)
            }
            this.$post_content_type.html(c(_.extend(_.clone(this.template_helpers), this.model.toJSON())));
            this.render_editor();
            this.$regular_image_upload = b("#regular_image_upload");
            this.$file_upload_overlay = this.$(".file_upload_overlay");
            this.post_form = this.$post_form;
            this.$shim = b(".textarea_shim");
            this.last_enter = this.post_form.get(0);
            this.model.init_uploader(this.$regular_image_upload);
            this.post_form_events = {
                dragenter: _.bind(this.__drag_enter, this),
                dragleave: _.bind(this.__drag_leave, this),
                dragover: _.bind(this.__drag_over, this),
                drop: _.bind(this.__drop, this)
            };
            Tumblr.PlaceHolders.init({
                els: this.$("#post_one"),
                clear_on_submit: true
            });
            if (tinymce && this.editor_type === "rich") {
                Tumblr.Editor.on("tinymce.image_upload.click", this.__image_upload, this);
                b.each(this.post_form_events, b.proxy(function (e, f) {
                    this.post_form.on(e + "." + this.cid, f)
                }, this))
            } else {
                this.$("#" + this.editor_id).autoexpand().resizeanchor()
            } if (typeof d === "function") {
                d()
            }
            if (this.post.is_reblog && b("#note_reblog_post_two")) {
                b("#note_reblog_post_two").html(this.post.safe_two)
            }
            return this
        },
        __drag_enter: function (c) {
            c.preventDefault();
            this.$shim.addClass("active");
            this.last_enter = c.target
        },
        __drag_leave: function (c) {
            c.preventDefault();
            if (c.target === this.last_enter || !this.last_enter) {
                this.$shim.removeClass("active")
            }
        },
        __drop: function (c) {
            this.$shim.removeClass("active")
        },
        __drag_over: function (c) {
            c.preventDefault();
            c.stopPropagation()
        },
        __image_upload: function (c) {
            if (c) {
                c.preventDefault()
            }
            if (this.is_ie9) {
                this.$file_upload_overlay.addClass("active").removeClass("offscreen")
            } else {
                b("#regular_image_upload").trigger("click")
            }
        },
        file_errors: function (c) {
            this.display_errors(c)
        },
        upload_complete: function (e) {
            var g = e.response[0].url;
            var c = this.editor_type;
            var f = this.editor_id;
            if ((c === "rich" || c === "tinymce") && tinyMCE && (ed = tinyMCE.get(f))) {
                var d = new Image();
                b(d).on("load", _.bind(function (h) {
                    ed.execCommand("mceInsertContent", false, '<img src="' + g + '" />');
                    ed.execCommand("mceInsertContent", false, "<p>");
                    setTimeout(function () {
                        ed.execCommand("mceAutoResize")
                    }, 100);
                    this.destroy_upload()
                }, this));
                d.src = g
            } else {
                if (c === "markdown") {
                    Tumblr.Editor.insertTag(f, "![](" + g + ")");
                    this.destroy_upload()
                } else {
                    Tumblr.Editor.insertTag(f, '<img src="' + g + '">');
                    this.destroy_upload()
                }
            }
        },
        upload_failed: function (c) {
            setTimeout(_.bind(function () {
                this.destroy_upload();
                this.display_errors({
                    error: c
                })
            }, this), 1000)
        },
        dismiss_upload: function (c) {
            if (c) {
                c.preventDefault()
            }
            this.model.cancel_upload();
            this.destroy_upload()
        },
        dismiss_file_upload_overlay: function (c) {
            if (c) {
                c.preventDefault()
            }
            this.$file_upload_overlay.addClass("offscreen").removeClass("active")
        },
        destroy_upload: function () {
            b(".upload_container").remove()
        },
        display_file_list: function (f, c) {
            this.dismiss_file_upload_overlay();
            this.hide_errors();
            var d = {
                name: f[0].name,
                prettySize: Tumblr.$.format_file_size(f[0].size),
                className: c
            };
            var e = _.template(this.$upload_list_template);
            this.$main_content.after(e(_.extend(_.clone(this.template_helpers), d)));
            b(".upload_container").addClass("bottom");
            this.$progress_bar = b(".upload_container .progress_bar");
            this.$processing = b(".upload_container .processing")
        },
        upload_progress: function (c) {
            this.$progress_bar.css({
                width: c + "%"
            });
            if (c > 99) {
                this.$processing.addClass("active")
            }
        },
        editor: function () {
            var c = b.extend({}, Tumblr.PostForms.editor_defaults, {
                layout: "bold,italic,strikethrough,link,unlink,numlist,bullist,pagebreak,image,image_upload,blockquote,spellchecker,code",
                plugins: "spellchecker,autoresize,safari,pagebreak,ajax_forms,image_upload,tumblr_popovers",
                focus: (this.model.get("edit") || this.model.get("reblog")) ? "focus_end" : true,
                type: this.editor_type
            });
            Tumblr.Editor.render(this.editor_id, c)
        }
    })
})(jQuery, Tumblr);
(function (b, a) {
    Tumblr.PostForms.Quote = Tumblr.PostForms.BaseView.extend({
        events: function () {
            return _.defaults({
                "click .label": "placeholder",
                "click .optional": "placeholder",
                "focus #post_two": "editor_focus"
            }, Tumblr.PostForms.BaseView.prototype.events)
        },
        render_view: function (f) {
            var d = b("#quote_subtemplate").html();
            var e = _.template(d);
            this.$post_content_type.html(e(_.extend(_.clone(this.template_helpers), this.model.toJSON())));
            this.editor();
            Tumblr.Editor.on("tinymce.focus", this.editor_focus, this);
            var c = this.$("#post_one");
            c.autoexpand().resizeanchor();
            Tumblr.PlaceHolders.init({
                els: c,
                clear_on_submit: true
            });
            if (this.editor_type !== "rich") {
                this.$("#post_two").autoexpand().resizeanchor()
            }
            if (typeof f === "function") {
                f()
            }
            return this
        },
        editor: function () {
            var c = b.extend({}, Tumblr.PostForms.editor_defaults, {
                type: this.editor_type,
                min_height: 70,
                focus: (this.model.get("edit") || this.model.get("reblog")) ? "focus_end" : true
            });
            Tumblr.Editor.render(this.editor_id, c)
        },
        editor_focus: function (c) {
            this.placeholder(null, this.$(".inset_label .label"))
        },
        placeholder: function (d, c) {
            if (d) {
                d.preventDefault();
                c = b(d.currentTarget);
                if (c.is("label.optional")) {
                    c = c.prevAll(".label")
                }
                if (this.editor_type !== "rich") {
                    this.$("#post_two").focus()
                }
            }
            c.fadeOut(250);
            c.nextAll(".optional").fadeOut(250);
            if (tinyMCE && this.editor_type === "rich") {
                this.$("#post_two_ifr").animate({
                    "min-height": 100
                }, 200);
                tinymce.execCommand("mceFocus", false, c.data("for"))
            }
        }
    })
})(jQuery, Tumblr);
(function (b, a) {
    Tumblr.PostForms.Link = Tumblr.PostForms.BaseView.extend({
        editor_id: "post_three",
        events: function () {
            return _.defaults({
                "click .label": "placeholder",
                'click .optional[for="post_three"]': "placeholder",
                "change #post_two": "change_url",
                "paste #post_two": "update_url",
                "keyup #post_two": "update_url",
                "keyup #post_one": "update_title",
                "focus #post_three": "editor_focus"
            }, Tumblr.PostForms.BaseView.prototype.events)
        },
        initialize: function () {
            this.constructor.__super__.initialize.call(this, this.options);
            this.$link_preview_template = b("#link_preview_subtemplate").html()
        },
        render_view: function (f) {
            var c = b("#link_subtemplate").html();
            var d = _.template(c);
            this.$post_content_type.html(d(_.extend(_.clone(this.template_helpers), this.model.toJSON())));
            this.editor();
            if (Tumblr.use_link_opengraph) {
                var e = _.template(this.$link_preview_template);
                this.$main_content.before(e(_.extend(_.clone(this.template_helpers), this.model.toJSON())));
                this.cache_selectors_view();
                this.$post_form.on("mousedown", ".reset", _.bind(this.reset, this));
                this.$preview_thumbnail.on("load", _.bind(this.thumbnail_alignment, this));
                this.$post_form.on("click", ".link_thumbnail_container .cancel", _.bind(this.remove_thumbnail, this));
                if (this.model.get("reblog")) {
                    this.$preview_thumbnail_container.addClass("no_replace no_upload")
                }
                if (this.model.get("edit") || this.model.get("reblog")) {
                    this.update_preview(this.current_fields());
                    this.$post_form.find(".reset").remove()
                }
            } else {
                this.cache_selectors_view()
            }
            Tumblr.PlaceHolders.init({
                els: b("#post_one, #post_two"),
                clear_on_submit: true
            });
            if (this.editor_type !== "rich") {
                this.$("#post_three").autoexpand().resizeanchor()
            }
            Tumblr.Editor.on("tinymce.focus", this.editor_focus, this);
            if (typeof f === "function") {
                f()
            }
            return this
        },
        cache_selectors_view: function () {
            this.$preview_container = this.$(".link_button_container");
            this.$preview = this.$(".link_button");
            this.$preview_thumbnail_container = this.$preview.children(".link_thumbnail_container");
            this.$preview_thumbnail = this.$preview.find(".link_thumbnail");
            this.$preview_thumbnail_upload = this.$preview.find(".upload_thumbnail");
            this.$preview_text_container = this.$preview.children(".link_text_container");
            this.$preview_text = this.$preview.find(".link_text");
            this.$preview_title = this.$preview.find(".link_title");
            this.$preview_source = this.$preview.find(".link_source");
            this.$post_one = this.$("#post_one");
            this.$post_two = this.$("#post_two");
            this.$post_three = this.$("#post_three");
            this.$post_source_url = this.$("#post_source_url");
            this.$remove_thumbnail = this.$('input[name="remove_thumbnail"]');
            this.$thumbnail_pre_upload = this.$('input[name="thumbnail_pre_upload"]');
            this.$upload_thumbnail = this.$('input[name="thumbnail"]')
        },
        change_url: function (g) {
            var c = "";
            var d = b(g.currentTarget);
            var f = b.trim(d.val());
            if (f) {
                if (f.match(/^magnet:/i)) {
                    c = f
                } else {
                    c = this.model.undup_protocol(this.model.add_protocol(f))
                }
            }
            d.val(c);
            if (!Tumblr.use_link_opengraph) {
                return
            }
            this.update_url(g, 100)
        },
        update_url: function (d, c) {
            if (Tumblr.use_link_opengraph) {
                if (this.$post_two.val()) {
                    this.$post_form.addClass("can_reset")
                } else {
                    this.$post_form.removeClass("can_reset")
                }
            }
            if (!Tumblr.use_link_opengraph) {
                return
            }
            if (this.model.get("reblog")) {
                return
            }
            if (this.model.get("edit") && d && d.type === "keyup") {
                return
            }
            if (this.$post_two.val() === this.previous_url) {
                return
            } else {
                this.previous_url = this.$post_two.val()
            }
            clearTimeout(this.fetch_timeout);
            this.fetch_timeout = _.delay(_.bind(this.url_update_fetch, this), c || 450)
        },
        update_title: function (c) {
            if (!Tumblr.use_link_opengraph) {
                return
            }
            if (this.model.get("reblog")) {
                return
            }
            return this.update_preview({
                title: this.$post_one.val()
            })
        },
        url_update_fetch: function () {
            clearTimeout(this.fetch_timeout);
            var c = this.$post_two.val();
            if (c && this.model.allowed_protocol(c)) {
                this.$post_form.addClass("show_preview");
                this.$preview_container.addClass("loading");
                this.model.fetch_og_meta(c, _.bind(this.use_og_meta, this), _.bind(this.use_og_meta, this))
            } else {
                if (!b.trim(c)) {
                    this.$post_form.removeClass("show_preview");
                    this.$preview_container.removeClass("loading");
                    var d = this.compare_fields(this.current_fields(), b.extend({
                        title: "",
                        description: "",
                        caption: "",
                        source: "",
                        image: "",
                        url: ""
                    }, this.previous_og_meta));
                    if (!d.title) {
                        this.$post_one.val("")
                    }
                    if (!d.description) {
                        switch (this.editor_type) {
                        case "rich":
                            var e = b("#ace_source_editor");
                            if (e.length) {} else {
                                this.rich_editor.execCommand("mceSetContent", false, this.remove_og_blockquote(this.rich_editor.getContent()))
                            }
                            break;
                        default:
                        case "markdown":
                            this.$post_three.val(this.remove_og_blockquote(this.$post_three.val()));
                            break
                        }
                    }
                }
            }
        },
        use_og_meta: function (e, c) {
            var f = {
                title: "",
                description: "",
                source: "",
                image: "",
                url: c
            };
            if (e && e.response) {
                f = b.extend(f, e.response)
            }
            if (!f.title && !f.description) {
                f.description = f.url
            }
            this.$post_form.addClass("show_preview");
            this.$preview_container.removeClass("loading");
            var d = this.compare_fields(this.current_fields(), b.extend({
                title: "",
                description: "",
                source: "",
                image: "",
                url: ""
            }, this.previous_og_meta), true);
            if (!d.title) {
                this.$post_one.val(f.title)
            }
            if (!d.description || !this.model.get("edit")) {
                this.add_blockquote_description(f.description, true)
            }
            if (!d.image || f.image) {
                this.$preview_thumbnail.attr("src", f.image);
                this.$upload_thumbnail.val(f.image);
                this.$thumbnail_pre_upload.val("1");
                this.$remove_thumbnail.val("")
            }
            this.update_preview(this.current_fields());
            this.previous_og_meta = f
        },
        current_fields: function () {
            var c = {
                title: this.$post_one.val(),
                caption: this.$post_three.val(),
                source: this.$post_source_url.val(),
                image: this.$upload_thumbnail.val(),
                url: this.$post_two.val()
            };
            if (this.editor_type === "rich" && this.rich_editor) {
                c.caption = this.rich_editor.getContent()
            }
            c.description = this.get_og_blockquote(c.caption);
            return c
        },
        compare_fields: function (d, c, f) {
            var e = {};
            b.each(d, function (g, h) {
                if (f && !c[g]) {
                    e[g] = false
                }
                if (typeof c[g] === "undefined") {
                    e[g] = true
                }
                e[g] = d[g] !== c[g]
            });
            b.each(c, function (g, h) {
                if (typeof d[g] === "undefined") {
                    e[g] = true
                }
                e[g] = d[g] !== c[g];
                if (f && !d[g]) {
                    e[g] = false
                }
            });
            return e
        },
        update_preview: function (c) {
            if (!c) {
                this.$post_form.removeClass("show_preview");
                return false
            }
            if (c.url) {
                this.$preview_container.find("a.link_title, a.link_source, a.link_thumbnail_click").attr("href", c.url)
            } else {
                c.url = this.$post_two.val()
            } if (c.url) {
                this.$post_form.addClass("show_preview")
            } else {
                this.$post_form.removeClass("show_preview");
                return false
            } if (c.title) {
                this.$preview_title.text(c.title);
                if (this.model.allowed_protocol(c.url)) {
                    this.$preview_source.text(c.url.replace(/([^\/]+:\/\/)?([^\/\?]+).*/i, "$2"))
                } else {
                    this.$preview_source.text(c.url)
                }
            } else {
                if (typeof c.title !== "undefined") {
                    this.$preview_title.text(c.url);
                    this.$preview_source.text("")
                }
            } if (this.$preview_title.text().length > 100 || this.$preview_text.height() > 110) {
                this.$preview.addClass("small")
            } else {
                this.$preview.removeClass("small")
            } if (c.image) {
                this.$preview_thumbnail.attr("src", c.image);
                this.$preview_thumbnail_container.addClass("has_image")
            } else {
                if (typeof c.image !== "undefined") {
                    this.$preview_thumbnail_container.removeClass("has_image")
                }
            }
            return true
        },
        add_blockquote_description: function (g, e) {
            var d = document.activeElement;
            var f = g ? '<blockquote class="link_og_blockquote">' + g + "</blockquote>" : "";
            var i = this.$post_three.val() || "<p></p>";
            var c = this.get_og_blockquote(i);
            switch (this.editor_type) {
            case "rich":
                i = this.rich_editor.getContent() || "<p></p>";
                c = this.get_og_blockquote(i);
                if (!(e || !b.trim(c) || !b.trim(b(i).text()))) {
                    return false
                }
                var h = b("#ace_source_editor");
                if (h.length) {} else {
                    this.rich_editor.focus();
                    this.rich_editor.selection.select(this.rich_editor.getBody(), true);
                    this.rich_editor.selection.collapse(true);
                    this.rich_editor.execCommand("mceSetContent", false, f + this.remove_og_blockquote(i));
                    this.rich_editor.selection.select(this.rich_editor.getBody(), true);
                    this.rich_editor.selection.collapse(false);
                    this.rich_editor.execCommand("mceFocus", false, "")
                } if (d) {
                    d.focus()
                }
                break;
            default:
            case "markdown":
                if (!(e || !b.trim(c) || !b.trim(b(i).text()))) {
                    return false
                }
                this.$post_three.val(f + this.remove_og_blockquote(i));
                break
            }
            return true
        },
        get_og_blockquote: function (e) {
            var c = /(<blockquote class="link_og_blockquote"(?:\s[^>]*)?>((?:\n|.)*)<\/\s*blockquote\s*>)/i;
            var d = e.match(c);
            if (d && d.length) {
                return d[0].replace(c, "$2")
            } else {
                return ""
            }
        },
        remove_og_blockquote: function (d) {
            var c = /(<blockquote class="link_og_blockquote"(?:\s[^>]*)?>((?:\n|.)*)<\/\s*blockquote\s*>)/i;
            return d.replace(c, "")
        },
        thumbnail_alignment: function (j) {
            var i = this.$preview_thumbnail.get(0).naturalWidth;
            var d = this.$preview_thumbnail.get(0).naturalHeight;
            var h = i / d;
            var f = this.$preview_thumbnail_container.width();
            var c = this.$preview_thumbnail_container.height();
            var g = f / c;
            if (i / d < f / c) {
                c /= h
            } else {
                f *= h
            }
            this.$preview_thumbnail.css({
                width: f,
                height: c,
                "margin-left": 0.5 * (this.$preview_thumbnail_container.width() - f),
                "margin-top": 0.5 * (this.$preview_thumbnail_container.height() - c)
            })
        },
        remove_thumbnail: function (c) {
            if (c) {
                c.preventDefault()
            }
            this.$preview_thumbnail_container.removeClass("has_image");
            this.$upload_thumbnail.val("");
            this.$thumbnail_pre_upload.val("");
            this.$remove_thumbnail.val("1")
        },
        reset: function (c) {
            this.$post_one.val("");
            this.$post_two.val("");
            this.$post_source_url.val("");
            this.$post_three.val("");
            if (this.editor_type === "rich") {
                this.rich_editor.execCommand("mceSetContent", false, "")
            }
            this.remove_thumbnail();
            this.update_preview(false);
            this.$post_form.removeClass("can_reset")
        },
        editor: function (d) {
            var c = b.extend({}, Tumblr.PostForms.editor_defaults, {
                type: this.editor_type,
                focus: (this.model.get("edit") || this.model.get("reblog")) ? "focus_end" : true
            });
            Tumblr.Editor.render(this.editor_id, c)
        },
        editor_focus: function (c) {
            this.placeholder(null, this.$(".inset_label .label"))
        },
        placeholder: function (d, c) {
            if (d) {
                d.preventDefault();
                c = b(d.currentTarget);
                if (c.is("label.optional")) {
                    c = c.prevAll(".label")
                }
                if (this.editor_type !== "rich") {
                    this.$("#post_three").focus()
                }
            }
            c.fadeOut(250);
            c.nextAll(".optional").fadeOut(250);
            if (tinyMCE && this.editor_type === "rich") {
                tinymce.execCommand("mceFocus", false, c.data("for"))
            }
        }
    })
})(jQuery, Tumblr);
(function (b, a) {
    Tumblr.PostForms.Conversation = Tumblr.PostForms.BaseView.extend({
        events: function () {
            return _.defaults({
                "input #post_two": "editor_focus"
            }, Tumblr.PostForms.BaseView.prototype.events)
        },
        render_view: function () {
            var c = _.template(b("#chat_subtemplate").html());
            this.$post_content_type.html(c(_.extend(_.clone(this.template_helpers), this.model.toJSON())));
            Tumblr.PlaceHolders.init({
                els: "#post_one",
                clear_on_submit: true
            });
            this.$post_two = this.$("#post_two");
            this.$post_two.autoexpand().resizeanchor();
            return this
        },
        editor_focus: function (c) {
            if (this.$("#post_two").val().length > 0) {
                this.placeholder(null, this.$(".inset_label .label"))
            }
        },
        placeholder: function (d, c) {
            if (d) {
                d.preventDefault();
                c = b(d.currentTarget);
                if (c.is("label.optional")) {
                    c = c.prevAll(".label")
                }
            }
            c.hide();
            c.nextAll(".optional").hide()
        }
    })
})(jQuery, Tumblr);
(function (b, a) {
    Tumblr.PostForms.LightTableImage = Backbone.Model.extend({
        initialize: function (c) {
            this.file = c;
            this.reader = new FileReader();
            if (this.reader.readAsBinaryString) {
                this.reader.onload = this.on_load_binary.bind(this);
                this.reader.readAsBinaryString(this.file)
            } else {
                this.read_data_url()
            }
            this.rotation = 0
        },
        read_data_url: function () {
            this.reader.onload = this.on_load_data_url.bind(this);
            this.data_url = this.reader.readAsDataURL(this.file)
        },
        on_load_binary: function (c) {
            this.binary = c.target.result;
            this.read_data_url();
            this.process_binary()
        },
        process_binary: function () {
            if (this.file.type == "image/jpg" || this.file.type == "image/jpeg") {
                try {
                    this.jpeg = new JpegMeta.JpegFile(this.binary, this.file.name);
                    switch (this.jpeg.tiff.Orientation.value) {
                    case 8:
                        this.rotation = 270;
                        break;
                    case 6:
                        this.rotation = 90;
                        break;
                    case 3:
                        this.rotation = 180;
                        break;
                    default:
                        this.rotation = 0;
                        break
                    }
                } catch (c) {}
            }
        },
        on_load_data_url: function (c) {
            this.data_url = c.target.result;
            this.img = new Image();
            this.img.onload = this.on_img_load.bind(this);
            this.img.src = this.data_url;
            this.trigger("data_url_ready", this)
        },
        on_img_load: function () {
            this.original_ratio = this.img.width / this.img.height;
            if (this.rotation == 90 || this.rotation == 270) {
                this.width = this.img.height;
                this.height = this.img.width
            } else {
                this.width = this.img.width;
                this.height = this.img.height
            }
            this.ratio = this.width / this.height;
            this.trigger("image_ready", this)
        },
        resize: function (g) {
            var d = this.img;
            var c = g / this.ratio;
            var e = document.createElement("canvas");
            e.width = g;
            e.height = c;
            var f = e.getContext("2d");
            if (this.rotation) {
                if (this.rotation == 90 || this.rotation == 270) {
                    var h = g;
                    g = c;
                    c = h
                }
                f.save();
                if (this.rotation == 180) {
                    f.translate(g / 2, c / 2)
                } else {
                    f.translate(c / 2, g / 2)
                }
                f.rotate(this.rotation * Math.PI / 180);
                f.drawImage(d, -(g / 2), -(c / 2), g, c);
                f.restore()
            } else {
                f.drawImage(d, 0, 0, g, c)
            }
            return e.toDataURL(this.file.type)
        }
    })
})(jQuery, Tumblr);
(function (b, a) {
        Tumblr.PostForms.Photo = Tumblr.PostForms.BaseView.extend({
                events: function () {
                    return _.defaults({
                        "click .help": "on_click_drop_zone",
                        "dragenter .drop_target": "enable_drop_zone",
                        "dragleave .drop_target": "disable_drop_zone",
                        "click .label": "placeholder",
                        "click .optional": "placeholder",
                        "mouseenter .item": "on_mouseenter",
                        "mouseleave .item": "on_mouseleave",
                        "click .linkthrough": "on_click_linkthrough",
                        "keydown .linkthrough .text_field": "on_keydown_linkthrough",
                        "click .caption .icon": "on_click_caption",
                        "click .x": "on_click_x",
                        "click .photo_form .caption_popover .dismiss": "on_click_caption_dismiss",
                        "keyup .photo_form .caption_popover textarea": "on_keyup_caption",
                        "focus #post_two": "editor_focus",
                        "click .url_button": "on_click_url_button",
                        "keydown .external_url": "on_keydown_external_url"
                    }, Tumblr.PostForms.BaseView.prototype.events)
                },
                layouts: {
                    "1": [1],
                    "2": [11, 2],
                    "3": [12, 21, 3],
                    "4": [121, 13, 22, 31],
                    "5": [122, 212, 23, 32],
                    "6": [123, 132, 213, 222, 33],
                    "7": [1222, 133, 223, 232, 322],
                    "8": [1223, 1232, 1322, 2222, 233, 323, 332],
                    "9": [1233, 1323, 2223, 2232, 2322, 3222, 333],
                    "10": [1333, 2233, 2323, 2332, 3223, 3232, 3322]
                },
                max_per_row: 3,
                initialize: function () {
                    this.constructor.__super__.initialize.call(this, this.options);
                    this.$sub_template = b("#photo_subtemplate").html();
                    this.photos = [];
                    this.files = [];
                    this.original_photos_length = 0;
                    this.$lighttable_template = b("#photo_grid_subtemplate").html();
                    this.$upload_list_template = b("#upload_photo_list_subtemplate").html();
                    this.model.on("change:upload_complete", this.upload_complete, this);
                    this.model.on("change:upload_file_error", this.file_errors, this);
                    this.model.on("change:upload_failed", this.upload_failed, this);
                    this.model.on("change:upload_files_added", this.files_added, this);
                    var c = {
                        lines: 11,
                        length: 4,
                        width: 2,
                        radius: 5,
                        color: "#b2bdc7",
                        speed: 0.9,
                        trail: 34,
                        shadow: false,
                        hwaccel: false,
                        className: "spinner",
                        zIndex: 2000000000,
                        top: "0",
                        left: "0"
                    };
                    this.photo_spinner = new Spinner(c)
                },
                destroy: function (c) {
                    if (this.webcam) {
                        this.webcam.destroy();
                        this.webcam = null
                    }
                    this.constructor.__super__.destroy.call(this, c)
                },
                hide_post_form: function (c, d) {
                    if (this.model.uploader_inititalized) {
                        this.model.destroy_uploader(this.$("#photo_file_input"))
                    }
                    this.constructor.__super__.hide_post_form.call(this, c, d)
                },
                upload_complete: function (c) {
                    _.each(c.response, function (f) {
                        for (var h = 0, e; e = this.photos[h]; h++) {
                            if (f.error) {
                                this.display_errors([__("Error uploading image")]);
                                this.abort();
                                var d = f.original_filename;
                                if (e.filename == d) {
                                    this.files = _.reject(this.files, function (i) {
                                        return encodeURIComponent(i.name) == d
                                    });
                                    this.photos = _.reject(this.photos, function (i) {
                                        return encodeURIComponent(i.filename) == d
                                    });
                                    this.image_loaders = _.reject(this.image_loaders, function (i) {
                                        return i.file.name == d
                                    });
                                    this.original_photos_length = this.photos.length - this.files.length;
                                    if (this.photos.length > 0) {
                                        this.determine_layout();
                                        this.render_cells()
                                    } else {
                                        var g = this.$(".item img").filter("[data-filename='" + (e.filename) + "']");
                                        g.closest(".item").remove();
                                        this.$(".photo_field").removeClass("small");
                                        this.$(".url_container").show();
                                        this.$(".help .default_text").show();
                                        this.$(".help .additional_text").hide();
                                        this.disable_submit()
                                    }
                                }
                            } else {
                                if (f.upload_id && (f.upload_id == e.upload_id) && !e.temp_url) {
                                    e.temp_url = f.url;
                                    break
                                } else {
                                    if (f.original_filename == e.filename && !e.temp_url) {
                                        e.temp_url = f.url;
                                        break
                                    }
                                }
                            }
                        }
                    }.bind(this))
                },
                upload_failed: function (c, d) {
                    this.display_errors(c);
                    this.photos = _.reject(this.photos, function (e) {
                        return (e.filename && !e.temp_url)
                    });
                    if (this.photos.length > 0) {
                        this.determine_layout();
                        this.render_cells()
                    } else {
                        this.disable_submit()
                    }
                },
                file_errors: function (d, c) {
                    this.display_errors(d)
                },
                render_view: function () {
                    var c = this;
                    var d = _.template(this.$sub_template);
                    this.lighttable_template = (_.template(this.$lighttable_template));
                    this.$post_content_type.html(d(_.extend(_.clone(this.template_helpers), this.model.toJSON())));
                    this.post = this.model.get("post");
                    if (this.post) {
                        if (this.post.photos) {
                            this.original_photos_length = this.post.photos.length;
                            this.photos = this.post.photos;
                            if (this.photos.length) {
                                this.layout = this.photos.length > 1 ? this.post.photoset_layout.toString() : "1";
                                this.render_cells();
                                this.enable_submit()
                            }
                        }
                        if (this.post.two || this.post.tags) {
                            this.$("#photo_caption").show();
                            this.$(".tag_editor").show()
                        }
                    }
                    if (_.isEmpty(this.post) || !this.post.is_reblog) {
                        this.model.init_uploader(this.$("#photo_file_input"), {
                            singleFileUploads: true,
                            limitConcurrentUploads: 10,
                            error_msg: {
                                errorSize: "File is too big. Max 10MB.",
                                errorType: "Only image files are allowed."
                            },
                            drop: _.bind(this.on_add_files, this),
                            change: _.bind(this.on_add_files, this)
                        });
                        if (Tumblr.Webcam) {
                            this.webcam = new Tumblr.Webcam({
                                el: "#webcam_container",
                                template: "#photo_grid_subtemplate",
                                btn: ".url_container .webcam_button",
                                on_show: function () {
                                    b(".photo_field").hide()
                                },
                                on_hide: function () {
                                    c.cancel_webcam();
                                    c.$(".photo_field").show().removeClass("small");
                                    c.$(".url_container").show()
                                },
                                on_snap: function (f, g, e, h) {
                                    c.load_raw_photo(f, g, e, h)
                                },
                                on_retake: function () {
                                    c.cancel_webcam()
                                }
                            })
                        }
                    }
                    this.editor();
                    if (this.editor_type !== "rich") {
                        this.$("#post_two").autoexpand().resizeanchor()
                    }
                    Tumblr.Editor.on("tinymce.focus", this.edi... = _.reject(this.photos, function (e) {
                            return encodeURIComponent(e.filename) == f || e.id == f
                        }); this.image_loaders = _.reject(this.image_loaders, function (e) {
                            return e.file.name == f
                        }); this.original_photos_length = this.photos.length - this.files.length;
                        var d = this.$(g.currentTarget).closest(".item");
                        var c = d.closest(".row"); d.remove();
                        if (!c.children().length) {
                            c.remove()
                        }
                        if (this.photos.length > 0) {
                            this.determine_layout();
                            this.render_cells()
                        } else {
                            this.$(".photo_field").removeClass("small");
                            this.$(".url_container").show();
                            this.$(".help .default_text").show();
                            this.$(".help .additional_text").hide();
                            this.disable_submit()
                        }
                    }, on_keyup_caption: _.throttle(function (h) {
                        if (h && h.keyCode === 13) {
                            h.preventDefault();
                            this.caption_popover.hide()
                        }
                        var k = b(h.currentTarget);
                        var f = k.val();
                        var j = k.closest(".caption");
                        var g = k.attr("maxlength") || 200;
                        var i = k.closest(".caption_popover").find(".length");
                        var d = g - f.length;
                        i.addClass("active").text(d);
                        var c = k.closest(".item").find("img").data("filename");
                        _.each(this.photos, function (e) {
                            if (e.id == c) {
                                e.caption = f
                            }
                        });
                        if (f) {
                            j.addClass("edited")
                        } else {
                            j.removeClass("edited")
                        }
                    }, 50),
                    on_click_drop_zone: function (c) {
                        this.$("#photo_file_input").trigger("click");
                        c.stopPropagation()
                    },
                    on_click_url_button: function (f) {
                        var c = b(f.currentTarget).closest(".url_container");
                        var d = c.find(".popover");
                        var g = c.find(".text_field");
                        this.url_popover = new Tumblr.MultiPopover(d.get(0), {
                            token: "post-plexi",
                            direction: "south",
                            on_show: b.proxy(function () {
                                g.focus();
                                this.on_show_popover.apply(this, arguments)
                            }, this),
                            on_hide: b.proxy(function () {
                                if (g.val()) {
                                    this.on_hide_popover.apply(this, arguments);
                                    this.load_external_url(g.val());
                                    g.val("")
                                }
                            }, this)
                        }).show();
                        d.addClass("active")
                    },
                    on_keydown_external_url: function (c) {
                        if (c && c.keyCode === 13) {
                            c.preventDefault();
                            c.stopPropagation();
                            this.url_popover.hide()
                        }
                    },
                    load_raw_photo: function (e, d, c, f) {
                        this.photos.push({
                            id: ("o" + (this.photos.length + 1)),
                            filename: "",
                            url: e,
                            photo_raw: e.split("base64,")[1],
                            width: d,
                            height: c,
                            is_selfie_gif: f,
                            is_selfie: true
                        });
                        this.original_photos_length++;
                        this.enable_submit();
                        this.determine_layout();
                        this.render_cells(true)
                    },
                    load_external_url: function (d) {
                        if (!d) {
                            return
                        }
                        var c = document.createElement("img");
                        var e = b(c);
                        e.one("load", _.bind(function (f) {
                            this.photos.push({
                                id: ("o" + (this.photos.length + 1)),
                                filename: "",
                                url: d,
                                external_url: d,
                                width: c.width,
                                height: c.height
                            });
                            this.original_photos_length++;
                            this.enable_submit();
                            this.determine_layout();
                            this.render_cells();
                            e.off()
                        }, this)).one("error", _.bind(function (f) {
                            this.display_errors([__("Error loading image from url")]);
                            e.off()
                        }, this));
                        c.src = d
                    },
                    upload_completed: function () {
                        var d = _.filter(this.photos, function (e) {
                            return e.filename
                        });
                        var c = _.every(d, function (e) {
                            return e.temp_url
                        });
                        return c
                    },
                    make_photo_inputs: function (c) {
                        this.$('[data-input="submit-meta"]').remove();
                        b("<input>").attr({
                            "data-input": "submit-meta",
                            type: "hidden",
                            name: "post[photoset_layout]",
                            value: this.layout
                        }).appendTo(this.$post_form);
                        b("<input>").attr({
                            "data-input": "submit-meta",
                            type: "hidden",
                            name: "post[photoset_order]",
                            value: _.pluck(this.photos, "id").join(",")
                        }).appendTo(this.$post_form);
                        _.each(this.photos, function (e, d) {
                            var f = e.id || "o" + (d + 1);
                            b("<input>").attr({
                                "data-input": "submit-meta",
                                type: "hidden",
                                name: "images[" + f + "]",
                                value: e.temp_url || ""
                            }).appendTo(this.$post_form);
                            if (e.external_url) {
                                b("<input>").attr({
                                    "data-input": "submit-meta",
                                    type: "hidden",
                                    name: "photo_src[]",
                                    value: e.external_url
                                }).appendTo(this.$post_form)
                            } else {
                                if (e.photo_raw) {
                                    b("<input>").attr({
                                        "data-input": "submit-meta",
                                        type: "hidden",
                                        name: "photo_raw[]",
                                        value: e.photo_raw
                                    }).appendTo(this.$post_form);
                                    b("<input>").attr({
                                        "data-input": "submit-meta",
                                        type: "hidden",
                                        name: "is_selfie",
                                        value: e.is_selfie
                                    }).appendTo(this.$post_form);
                                    b("<input>").attr({
                                        "data-input": "submit-meta",
                                        type: "hidden",
                                        name: "is_selfie_gif",
                                        value: e.is_selfie_gif
                                    }).appendTo(this.$post_form)
                                }
                            }
                        }, this);
                        _.each(this.$(".photos textarea"), _.bind(function (d, e) {
                            d.name = "caption[" + this.photos[e].id + "]"
                        }, this))
                    },
                    submit: function (d) {
                        this.disable_submit();
                        this.hide_errors();
                        var c = this.$post_form.find('[name="preview_post"]').val();
                        if (!c) {
                            d.preventDefault()
                        }
                        if (this.upload_completed()) {
                            this.enable_submit();
                            this.make_photo_inputs(c);
                            this.constructor.__super__.submit.call(this, d)
                        } else {
                            if (c) {
                                d.preventDefault();
                                return
                            }
                            this.show_loader();
                            clearInterval(this.submit_loop);
                            this.submit_loop = setInterval(function () {
                                if (!this.upload_completed()) {
                                    return false
                                }
                                this.enable_submit();
                                this.make_photo_inputs(c);
                                this.constructor.__super__.submit.call(this, d);
                                clearInterval(this.submit_loop)
                            }.bind(this), 30)
                        }
                    },
                    abort: function () {
                        this.hide_loader();
                        clearInterval(this.submit_loop)
                    },
                    cancel_webcam: function () {
                        this.photos = [];
                        this.original_photos_length = 0;
                        this.disable_submit()
                    },
                    preview_on_blog: function (d) {
                        if (!this.upload_completed()) {
                            this.show_loader();
                            Tumblr.MultiPopover.hideAll();
                            var c = setInterval(function () {
                                if (!this.upload_completed()) {
                                    return false
                                }
                                this.hide_loader();
                                this.constructor.__super__.preview_on_blog.call(this, d);
                                clearInterval(c)
                            }.bind(this), 30);
                            return false
                        }
                        this.constructor.__super__.preview_on_blog.call(this, d)
                    }
                })
        })(jQuery, Tumblr);
    (function (b, a) {
        Tumblr.LightTableView = Tumblr.SortableView.extend({
            events: function () {
                var c = _.isFunction(Tumblr.SortableView.prototype.events) ? Tumblr.SortableView.prototype.events.call(this) : Tumblr.SortableView.prototype.events;
                return _.extend({
                    dragover: "on_dragover",
                    "dragleave .drop": "on_dragleave",
                    drop: "on_drop"
                }, c)
            },
            initialize: function () {
                Tumblr.SortableView.prototype.initialize.apply(this, arguments);
                this.max_per_row = this.options.max_per_row || 3;
                this.$shim = b('<div class="item shim" style="width:0;"></div>');
                this.animation_duration = 600;
                var d = this.$("img.thumb");
                var c = setInterval(function () {
                    var e = _.every(d, function (f) {
                        return f.complete && f.clientHeight
                    });
                    if (e) {
                        this.equalize();
                        clearInterval(c);
                        if (this.options.on_initialize) {
                            this.options.on_initialize(this)
                        }
                    }
                }.bind(this), 30)
            },
            disable_drag: function () {
                this.items.attr("draggable", false)
            },
            on_dragstart: function (i) {
                b(this.options.el).addClass("dragging");
                this.$(this.options.items).attr("draggable", false);
                Tumblr.SortableView.prototype.on_dragstart.apply(this, arguments);
                this.$(".placeholder").remove();
                this.placeholder = this.$(this.dragged).clone().addClass("placeholder").removeClass("sortable-dragging").attr("draggable", false).get(0);
                this.dropped = false;
                i.originalEvent.dataTransfer.dropEffect = "move";
                var h = this.$(i.currentTarget).parent(".row");
                this.origin_row = h;
                var c = h.find(this.options.items).length;
                var d = c - 1;
                var f = d * 10;
                var g = (500 - f) / c;
                this.$(i.currentTarget).find(".controls").hide();
                this.placeholder.style.width = g + "px";
                this.placeholder.style.height = this.dragged.clientHeight + "px";
                this.drag_x = i.originalEvent.offsetX;
                this.drag_y = i.originalEvent.offsetY;
                this.$(".drop").show();
                window.setTimeout(function () {
                    this.$(i.currentTarget).after(this.placeholder);
                    this.$(this.placeholder).addClass("active");
                    this.$(this.dragged).css({
                        "z-index": "1000",
                        position: "absolute",
                        visibility: "hidden"
                    });
                    this.$el.append(this.dragged)
                }.bind(this), 0)
            },
            on_dragenter: function (d) {
                _.each(this.$(".row"), function (e) {
                    if (!this.$(e).children().length) {
                        this.$(e).remove()
                    }
                }, this);
                var c = d.currentTarget;
                this.last_droppable = c
            },
            on_dragover: function (g) {
                if (g.currentTarget == this.el || !this.dragged) {
                    return false
                }
                this.reset_marker();
                var d = this.$(g.currentTarget);
                var h = d.parent(".row");
                var l = g.originalEvent.pageX - d.offset().left;
                var i = g.originalEvent.pageY - d.offset().top;
                var j = g.currentTarget.getBoundingClientRect();
                var f = this.$(g.currentTarget).position();
                var k = "";
                var c = "";
                if (i < j.height / 5) {
                    k = "top";
                    this.$(".horizontal_marker").css({
                        top: f.top - 5 + "px"
                    }).show()
                } else {
                    if (i > (j.height - j.height / 5)) {
                        k = "bottom";
                        this.$(".horizontal_marker").css({
                            top: f.top + j.height + 5 + "px"
                        }).show()
                    } else {
                        if (l < j.width / 2 && (h.children().not(".placeholder").not(".shim").length < this.options.max_per_row)) {
                            c = "left";
                            this.$(".vertical_marker").css({
                                top: f.top,
                                left: f.left - 5 + "px",
                                height: j.height + 6
                            }).show()
                        } else {
                            if (l > (j.width - j.width / 2) && (h.children().not(".placeholder").not(".shim").length < this.max_per_row)) {
                                c = "right";
                                this.$(".vertical_marker").css({
                                    top: f.top,
                                    left: f.left + j.width + 5 + "px",
                                    height: j.height + 6
                                }).show()
                            }
                        }
                    }
                } if (c) {
                    if (!d.hasClass(c)) {
                        d.addClass(c)
                    }
                } else {
                    if (k) {
                        if (!d.hasClass(k)) {
                            h.addClass(k)
                        }
                    } else {
                        this.drop_allowed = false;
                        return
                    }
                }
                this.drop_allowed = true;
                g.preventDefault()
            },
            on_dragleave: function (c) {
                if (this.real_dragleave(c)) {
                    this.reset_marker();
                    this.last_droppable = null
                }
            },
            real_dragleave: function (d) {
                var c = d.currentTarget.getBoundingClientRect();
                return (d.originalEvent.x > c.left + c.width || d.originalEvent.x < c.left || d.originalEvent.y > c.top + c.height || d.originalEvent.y < c.top)
            },
            on_drop: function (g) {
                if (!this.drop_allowed) {
                    return
                }
                if (g.originalEvent.dataTransfer.files.length) {
                    return
                }
                if (!this.last_droppable || this.last_droppable == this.dragged) {
                    return
                }
                this.$(".drop").hide();
                if (g.currentTarget == this.placeholder) {
                    this.$shim.css({
                        height: this.placeholder.clientHeight
                    })
                }
                var d = this.insert_shim();
                if (d === false) {
                    return
                }
                this.reset_marker();
                if ((this.$(g.currentTarget).is(this.options.items))) {
                    this.position_dragged_in_drop_spot(g.originalEvent.offsetX, g.originalEvent.offsetY, true)
                } else {
                    var j = g.originalEvent.offsetX - this.$el.offset().left;
                    var h = g.originalEvent.offsetY - this.$el.offset().top;
                    this.position_dragged_in_drop_spot(j, h, false)
                }
                var k = this.$shim.parent().children().not(".shim").not(".placeholder").add(this.dragged);
                var f = this.dimensions(k);
                var l;
                if (this.$shim.parent().is(this.$(this.placeholder).parent())) {
                    l = f
                } else {
                    var c = this.$(this.placeholder).parent().children().not(".shim").not(".placeholder").not(this.dragged);
                    l = c.length ? this.dimensions(c) : {
                        width: this.$(this.placeholder).width(),
                        height: this.$(this.placeholder).height()
                    }
                }
                var i = this.destination_coordinates(f, l);
                this.update_layout(l, f, i);
                window.setTimeout(this.after_update.bind(this), this.animation_duration);
                this.dropped = true;
                g.stopPropagation()
            },
            on_dragend: function (c) {
                b(this.options.el).removeClass("dragging");
                if (!this.dropped) {
                    this.reset_marker();
                    this.revert()
                }
                this.$(this.options.items).attr("draggable", true)
            },
            revert: function () {
                this.$(".drop").hide();
                this.$(this.placeholder).detach().css({});
                this.origin_row.append(b(this.dragged).css({
                    position: "relative",
                    visibility: "visible",
                    top: 0,
                    left: 0,
                    "z-index": "auto"
                }));
                this.dragged = null
            },
            equalize: function () {
                _.each(this.$(".row"), function (h) {
                    for (var e = 0, g; g = h.childNodes[e]; ++e) {
                        if (g.nodeType == 3) {
                            h.removeChild(g)
                        }
                    }
                    var c = this.$(h).find(this.options.items);
                    if (!c.length || c.length == 1) {
                        return
                    }
                    var j = c.find("img");
                    var f = _.map(j, function (k) {
                        if (k.clientHeight === 0) {
                            console.error("photo with 0 height")
                        }
                        return k.clientHeight
                    });
                    var d = _.min(f);
                    c.css({
                        height: d + "px"
                    })
                }.bind(this))
            },
            vertically_center_images: function () {
                _.each(this.$(".row"), function (d) {
                    var c = this.$(d).find(this.options.items);
                    var e = c.find("img");
                    _.each(e, function (g) {
                        var f = this.$(g).height();
                        if (f > c.height()) {
                            var h = (f - c.height()) / 2;
                            this.$(g).css({
                                top: -h + "px"
                            })
                        } else {
                            this.$(g).css({
                                top: 0
                            })
                        }
                    }.bind(this))
                }.bind(this))
            },
            min_ratio: function (c) {
                var d = _.map(c, function (e) {
                    return e.clientHeight / e.clientWidth
                });
                min_ratio = _.min(d);
                return min_ratio
            },
            reset_marker: function () {
                this.$(".row").removeClass("top bottom");
                this.$(this.options.items).removeClass("right left");
                this.$(".horizontal_marker").css({
                    top: 0
                }).hide();
                this.$(".vertical_marker").css({
                    top: 0,
                    left: 0
                }).hide()
            },
            insert_shim: function () {
                var d = this.$(this.last_droppable).parent(".row");
                var c = d.clone().empty().get(0);
                if (this.$(this.last_droppable).hasClass("right")) {
                    this.$(this.last_droppable).after(this.$shim[0]);
                    this.$el.append(this.dragged)
                } else {
                    if (this.$(this.last_droppable).hasClass("left")) {
                        this.$(this.last_droppable).before(this.$shim[0]);
                        this.$el.append(this.dragged)
                    } else {
                        if (d.hasClass("top")) {
                            d.before(c);
                            c.appendChild(this.$shim[0]);
                            this.$el.append(this.dragged)
                        } else {
                            if (d.hasClass("bottom")) {
                                d.after(c);
                                c.appendChild(this.$shim[0]);
                                this.$el.append(this.dragged)
                            } else {
                                return false
                            }
                        }
                    }
                }
            },
            position_dragged_in_drop_spot: function (e, h, d) {
                var g, f;
                if (d) {
                    var c = this.$(this.last_droppable).position() || {
                        left: 0,
                        top: 0
                    };
                    g = e + c.left - this.drag_x;
                    f = h + c.top - this.drag_y
                } else {
                    g = e - this.drag_x;
                    f = h - this.drag_y
                }
                this.$(this.dragged).removeClass("item").css({
                    top: f + "px",
                    left: g + "px",
                    position: "absolute"
                })
            },
            dimensions: function (c) {
                var d = {};
                var e = (c.length - 1) * 10;
                d.width = (500 - e) / c.length;
                d.min_ratio = this.min_ratio(c.find("img"));
                d.height = d.width * d.min_ratio;
                return d
            },
            destination_coordinates: function (c, d) {
                var e = this.$shim.parent().children().index(this.$shim);
                var g = this.destination_offset(c, d);
                var f = {};
                f.left = ((e) * c.width) + (e * 10) - g.left;
                f.top = this.$shim.position().top + g.top;
                return f
            },
            destination_offset: function (c, d) {
                var e = this.$shim.parent().children().index(this.$shim);
                var f = this.$(this.placeholder).parent().children().index(this.$(this.placeholder));
                var g = {};
                g.left = 0;
                if (this.$shim.parent().is(this.$(this.placeholder).parent()) && f < e) {
                    g.left = c.width
                }
                g.top = 0;
                if (this.$(".row").index(this.$(this.placeholder).parent()) < this.$(".row").index(this.$shim.parent())) {
                    if (!this.$(this.placeholder).siblings().length) {
                        g.top = -d.height
                    } else {
                        g.top = (d.height / d.width * d.width) - this.$(this.dragged).height()
                    }
                }
                if (g.top == -Infinity) {}
                return g
            },
            update_layout: function (d, c, e) {
                this.$(this.placeholder).siblings(this.options.items).not(".shim").css({
                    width: d.width + "px",
                    height: d.height + "px"
                });
                this.$(this.placeholder).removeClass("active").css({
                    height: 0,
                    width: 0
                });
                this.$shim.parent().children(this.options.items).not(".placeholder").css({
                    width: c.width,
                    height: c.height
                });
                window.setTimeout(function () {
                    this.$(this.dragged).addClass("item").css({
                        width: c.width + "px",
                        height: c.height + "px",
                        top: e.top + "px",
                        left: e.left + "px",
                        visibility: "visible"
                    })
                }.bind(this), 0)
            },
            after_update: function () {
                if (!this.$shim.is(":visible")) {
                    this.dragged = null;
                    return
                }
                var c = this.$(this.placeholder).parent(".row");
                this.$(this.dragged).removeClass("sortable-dragging");
                this.$shim.replaceWith(b(this.dragged).css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    "z-index": "auto"
                }));
                this.$shim.css({
                    height: 0,
                    width: 0
                });
                this.$(this.placeholder).detach().css({});
                if (!c.children().length) {
                    c.remove()
                }
                this.$(this.options.items).attr("draggable", true);
                this.callback(this);
                this.dragged = null
            }
        })
    })(jQuery, Tumblr);
    (function (b, a) {
            Tumblr.PostForms.Audio = Tumblr.PostForms.BaseView.extend({
                    last_term: "",
                    spotify_pattern: /(open\.spotify\.com|spotify)[\/|:](track|album|artist|playlist|user)[\/|:](.*)?([\d\w]{22})$/,
                    soundcloud_pattern: /(http|https):\/\/soundcloud\.com\/[^\/]+\/(sets\/)?[^\/]+\/?$/,
                    bandcamp_pattern: /(http|https):\/\/(?:([^\/]+\.)\.bandcamp\.com|[^\/]+\.[^\/]+)\/(track|album)\/[^\/]+$/,
                    mp3_pattern: /(.mp3)$/i,
                    events: function () {
                        return _.defaults({
                            "click .label": "placeholder",
                            "click .optional": "placeholder",
                            "click .audio_tabs a": "tab_switcher",
                            "keyup #audio_search_field": "audio_search",
                            "keydown #audio_search_field": "keydown",
                            "keydown #post_three": "keydown",
                            "click #audio_search_results li": "search_result_click",
                            "keyup #post_three": "external_url_keyup",
                            "paste #post_three": "external_url_paste"
                        }, Tumblr.PostForms.BaseView.prototype.events)
                    },
                    initialize: function () {
                        this.constructor.__super__.initialize.call(this, this.options);
                        this.$sub_template = b("#audio_subtemplate").html();
                        this.$spotify_template = b("#audio_spotify_subtemplate").html();
                        this.$soundcloud_template = b("#audio_soundcloud_subtemplate").html();
                        this.$spotify_preview_template = b("#audio_spotify_preview_subtemplate").html();
                        this.$soundcloud_track_preview_template = b("#audio_soundcloud_track_preview_subtemplate").html();
                        this.$soundcloud_playlist_preview_template = b("#audio_soundcloud_playlist_preview_subtemplate").html();
                        this.$bandcamp_preview_template = b("#audio_bandcamp_preview_subtemplate").html();
                        this.$upload_list_template = b("#upload_list_subtemplate").html();
                        this.$upload_preview_template = b("#audio_upload_preview_subtemplate").html();
                        this.$preview_player_template = b("#audio_preview_player_subtemplate").html();
                        this.$upload_tos_template = b("#upload_tos_subtemplate").html();
                        this.model.on("change:audio_search", this.render_search_results, this);
                        this.model.on("change:audio_search_failed", this.render_server_error, this);
                        this.model.on("change:upload_progress", this.upload_progress, this);
                        this.model.on("change:upload_complete", this.upload_complete, this);
                        this.model.on("change:upload_file_error", this.file_errors, this);
                        this.model.on("change:upload_failed", this.upload_failed, this);
                        this.model.on("change:send_file", this.display_file_list, this);
                        this.$post_form.on("click", ".dismiss_preview", _.bind(function (c) {
                            c.preventDefault();
                            c.stopPropagation();
                            this.dismiss_preview();
                            return false
                        }, this));
                        this.$post_form.on("click", ".preview_player", _.bind(function (d) {
                            d.preventDefault();
                            d.stopPropagation();
                            var c = b(d.currentTarget);
                            this.preview_track(c.data("stream"));
                            return false
                        }, this));
                        this.$post_form.on("click", "#file_list .cancel", _.bind(this.dismiss_upload, this));
                        this.$post_form.on("click", "#audio_album_art .cancel", _.bind(this.replace_artwork, this))
                    },
                    destroy: function (c) {
                        this.constructor.__super__.destroy.call(this, c);
                        this.destroy_preview()
                    },
                    render_view: function (e) {
                        var d = _.template(this.$sub_template);
                        this.$post_content_type.html(d(_.extend(_.clone(this.template_helpers), this.model.toJSON())));
                        this.editor();
                        var c = _.template(this.$upload_tos_template);
                        this.$main_content.after(c({}));
                        this.cache_selectors_view();
                        this.$tos_container = b("#upload_tos").hide();
                        if (!this.model.get("reblog")) {
                            this.model.init_uploader(this.$audio_file_input, {
                                error_msg: {
                                    errorSize: "File is too big. Max 10MB.",
                                    errorType: "Only audio files are allowed."
                                }
                            })
                        }
                        Tumblr.PlaceHolders.init({
                            clear_on_submit: true
                        });
                        Tumblr.Editor.on("tinymce.focus", this.editor_focus, this);
                        this.post = this.model.get("post");
                        if (this.model.get("edit") || this.model.get("reblog")) {
                            this.model.on("post:form:animation:start", function () {
                                this.render_external_url();
                                if (this.post.is_reblog) {
                                    this.$audio_preview_container.addClass("reblog");
                                    this.$(".dismiss_preview").remove()
                                }
                                if (this.audio_player) {
                                    _.delay(function () {
                                        this.audio_player.truncate_text()
                                    }.bind(this), 100)
                                }
                            }, this)
                        }
                        if (typeof e === "function") {
                            e()
                        }
                        return this
                    },
                    render_external_url: function () {
                        var e = this.model.get("post");
                        var f = {};
                        if (e && !_.isEmpty(e)) {
                            this.$tag_editor.show();
                            this.$audio_description.show();
                            if (!e.three) {
                                f = {
                                    href: "",
                                    stream: e.audio_url,
                                    provider: "upload",
                                    artwork: e.audio_artwork,
                                    Title: e.id3_tags.Title,
                                    Artist: e.id3_tags.Artist,
                                    Album: e.id3_tags.Album
                                };
                                this.render_preview(f);
                                this.switch_tab(this.$audio_upload_tab);
                                this.$audio_upload.hide();
                                if (this.model.get("edit") || this.model.get("reblog")) {
                                    this.enable_submit();
                                    b("#upload_arwork").val("");
                                    b("#pre_upload").val("1")
                                }
                            } else {
                                var c = e.three.match(this.spotify_pattern);
                                var d = e.three.match(this.soundcloud_pattern);
                                var h = e.three.match(this.bandcamp_pattern);
                                var g = false;
                                if (c) {
                                    g = "spotify"
                                } else {
                                    if (d) {
                                        g = "soundcloud"
                                    } else {
                                        if (h) {
                                            g = "bandcamp"
                                        }
                                    }
                                } if (g) {
                                    f = {
                                        href: e.three,
                                        provider: g,
                                        artwork: ""
                                    };
                                    if (!c) {
                                        f.artwork = e.audio_artwork;
                                        f.stream = e.audio_url;
                                        f.Title = e.id3_tags.Title;
                                        f.Artist = e.id3_tags.Artist;
                                        f.Album = e.id3_tags.Album
                                    }
                                    if (h && e.bandcamp) {
                                        f.id = e.bandcamp.id;
                                        f.type = e.bandcamp.type
                                    }
                                    this.render_preview(f)
                                } else {
                                    this.switch_tab(this.$external_audio_tab);
                                    f.artwork = e.audio_artwork;
                                    f.href = e.audio_url;
                                    f.stream = e.audio_url;
                                    f.Title = e.id3_tags.Title;
                                    f.Artist = e.id3_tags.Artist;
                                    f.Album = e.id3_tags.Albu...unction() {
                                        b(".audio_preview_container").remove();
                                        this.disable_submit()
                                    }, destroy_upload: function () {
                                        b(".upload_container").remove();
                                        this.$main_content.removeClass("audio_upload")
                                    },
                                    render_search_results: function (e) {
                                        var d;
                                        this.$search_loader.fadeOut(this.fade_duration);
                                        this.$audio_search_results.show();
                                        this.$audio_search_error.hide();
                                        if (e.type === "spotify") {
                                            d = _.template(this.$spotify_template);
                                            this.$audio_results_spotify.html(d(_.extend(_.clone(this.template_helpers), e)))
                                        } else {
                                            if (e.type == "soundcloud") {
                                                d = _.template(this.$soundcloud_template);
                                                this.$audio_results_soundcloud.html(d(_.extend(_.clone(this.template_helpers), e)))
                                            } else {}
                                        }
                                        var c = this.$audio_search_results.find("li");
                                        if (c.length) {
                                            this.$audio_no_results.hide()
                                        } else {
                                            this.$audio_no_results.show()
                                        }
                                    },
                                    render_server_error: function (c) {
                                        this.$("#audio_search_results_" + c).empty();
                                        var d = this.$audio_search_results.find("li");
                                        if (!d.length) {
                                            this.$audio_search_results.show();
                                            this.$audio_search_error.show();
                                            this.$search_loader.fadeOut(this.fade_duration)
                                        } else {
                                            this.$audio_search_error.hide()
                                        }
                                    },
                                    animate_results: function (c) {
                                        c.first().fadeIn(350, function () {
                                            b(this).show()
                                        });
                                        if (c.length > 0) {
                                            this.animate_timer = setTimeout(_.bind(function () {
                                                this.animate_results(c.slice(1))
                                            }, this), 50)
                                        } else {
                                            clearTimeout(this.animate_timer)
                                        }
                                    },
                                    dismiss_preview: function () {
                                        this.destroy_preview();
                                        this.$main_content.removeClass("audio_preview");
                                        this.$audio_options.filter(".active").show();
                                        this.$tabs.show();
                                        this.$post_three.val("");
                                        this.$preuploaded_url.val("");
                                        this.$file_upload.show();
                                        if (this.media_element) {
                                            this.media_element.pause()
                                        }
                                        this.model.enable_uploader(this.$audio_file_input)
                                    },
                                    preview_track: function (c) {
                                        if (!_.isFunction(MediaElement)) {
                                            return
                                        }
                                        if (this.media_element) {
                                            this.media_element.pause()
                                        }
                                        if (this.$preview_player.hasClass("play")) {
                                            this.$audio_preview.get(0).src = c;
                                            if (!this.media_element) {
                                                this.media_element = new MediaElement("audio_preview_track", {
                                                    pluginPath: "/javascript/mediaelement/",
                                                    success: function (d) {
                                                        d.play()
                                                    },
                                                    error: function () {}
                                                })
                                            } else {
                                                this.media_element.setSrc(this.$audio_preview.get(0).src);
                                                this.media_element.play()
                                            }
                                            this.$preview_player.removeClass("play").addClass("stop")
                                        } else {
                                            this.$preview_player.removeClass("stop").addClass("play")
                                        }
                                    },
                                    display_file_list: function (f, c, h) {
                                        var g = (h.selector === "#art_upload_input") ? true : false;
                                        this.$("#tab_audio_upload").trigger("click");
                                        this.hide_errors();
                                        var d = {
                                            name: f[0].name,
                                            prettySize: Tumblr.$.format_file_size(f[0].size),
                                            className: c
                                        };
                                        var e = _.template(this.$upload_list_template);
                                        this.$main_content.before(e(_.extend(_.clone(this.template_helpers), d)));
                                        this.initiate_upload(g);
                                        this.$progress_bar = b(".upload_container .progress_bar");
                                        this.$processing = b(".upload_container .processing")
                                    },
                                    file_errors: function (d, c) {
                                        this.$("#tab_audio_upload").trigger("click");
                                        this.display_errors(d)
                                    },
                                    initiate_upload: function (c) {
                                        if (c) {
                                            this.$("#upload_artwork").val("")
                                        } else {
                                            this.$("#pre_upload").val("1");
                                            this.$upload_tos.show();
                                            this.$tos_container.show();
                                            this.$main_content.addClass("audio_upload")
                                        }
                                        this.$tabs.hide();
                                        this.$audio_description.show();
                                        this.$tag_editor.show();
                                        this.$file_list.show();
                                        this.$file_upload.hide();
                                        this.hide_errors()
                                    },
                                    upload_progress: function (c) {
                                        this.$progress_bar.css({
                                            width: c + "%"
                                        });
                                        if (c > 99) {
                                            this.$processing.addClass("active")
                                        }
                                    },
                                    upload_complete: function (c, d) {
                                        if (d.selector === "#art_upload_input") {
                                            this.artwork_upload_complete(c)
                                        } else {
                                            this.audio_upload_complete(c)
                                        }
                                        this.destroy_upload()
                                    },
                                    audio_upload_complete: function (d) {
                                        var c = b.extend({
                                            provider: "upload",
                                            stream: d.response[0].url,
                                            href: d.response[0].url,
                                            artwork: d.response[0].album_art_url,
                                            upload_artwork: "1"
                                        }, d.response[0].id3);
                                        this.render_preview(c)
                                    },
                                    artwork_upload_complete: function (e) {
                                        var d = e.response[0].url;
                                        this.$artwork.show();
                                        if (this.$artwork.find("img").length) {
                                            this.$artwork.find("img").attr("src", d)
                                        } else {
                                            var c = b("<img/>", {
                                                src: d
                                            });
                                            this.$artwork.append(c)
                                        }
                                        this.$artwork_field.val(d);
                                        this.$remove_artwork.val("");
                                        this.$artwork_pre_upload.val("1");
                                        this.$audio_album_art.removeClass("empty")
                                    },
                                    upload_failed: function (c) {
                                        this.display_errors({
                                            error: c
                                        });
                                        this.$file_upload.show();
                                        this.$tabs.show();
                                        this.$audio_description.hide();
                                        this.$tag_editor.hide();
                                        this.$tos_container.hide();
                                        this.destroy_upload()
                                    },
                                    dismiss_upload: function (c) {
                                        if (c) {
                                            c.preventDefault()
                                        }
                                        this.model.cancel_upload();
                                        this.destroy_upload();
                                        this.$file_upload.show();
                                        this.$tabs.show()
                                    },
                                    replace_artwork: function (d) {
                                        if (d) {
                                            d.preventDefault()
                                        }
                                        var c = b(d.currentTarget);
                                        this.$artwork.hide();
                                        this.$audio_album_art.addClass("empty");
                                        this.$upload_artwork.val("");
                                        this.$artwork_pre_upload.val("");
                                        this.$remove_artwork.val("1")
                                    },
                                    tab_switcher: function (d) {
                                        d.preventDefault();
                                        var c = b(d.currentTarget);
                                        this.switch_tab(c)
                                    },
                                    switch_tab: function (d) {
                                        this.$tab_selectors.removeClass("active");
                                        d.addClass("active");
                                        this.$audio_options.removeClass("active").hide();
                                        var c = d.attr("href");
                                        var e = this.$("#" + c);
                                        e.addClass("active").show();
                                        if (d.attr("id") !== "tab_audio_upload") {
                                            this.$upload_tos.hide();
                                            this.$post_form.removeClass("no_preview")
                                        } else {
                                            this.$post_form.addClass("no_preview")
                                        }
                                        this.hide_errors()
                                    }
                                })
                        })(jQuery, Tumblr);
                    (function (b, a) {
                            Tumblr.PostForms.Video = Tumblr.PostForms.BaseView.extend({
                                    last_term: "",
                                    recognized_patterns: [],
                                    events: function () {
                                        return _.defaults({
                                            "click .label": "placeholder",
                                            "click .optional": "placeholder",
                                            "keyup #post_one": "type_embed_code",
                                            "paste #post_one": "paste_embed_code",
                                            "focus #post_two": "editor_focus"
                                        }, Tumblr.PostForms.BaseView.prototype.events)
                                    },
                                    find_tags: function (f, c, h) {
                                        if (!c) {
                                            c = "iframe"
                                        }
                                        if (!h) {
                                            h = "src"
                                        }
                                        var g = new RegExp("<(?:" + c + ")(\\s[^>]*)?>", "mig");
                                        var e = new RegExp(".*\\s(?:" + h + ")\\s*=\\s*(\"([^\"]*)\"|'([^']*)').*", "i");
                                        var d = f.match(g);
                                        if (!d) {
                                            return []
                                        }
                                        b.each(d, function (k, j) {
                                            d[k] = {
                                                tag: j,
                                                prop: e.test(j) ? j.replace(e, "$2$3") : false
                                            }
                                        });
                                        return d
                                    },
                                    match_service: function (e) {
                                        var d;
                                        var c = false;
                                        b.each(this.recognized_patterns, function (f, g) {
                                            d = g.exp.exec(e);
                                            if (d) {
                                                c = {
                                                    orig_embed_code: e,
                                                    url: d[1],
                                                    video_id: d[2],
                                                    service: g.service
                                                }
                                            }
                                        });
                                        return c
                                    },
                                    initialize: function () {
                                        this.constructor.__super__.initialize.call(this, this.options);
                                        this.$sub_template = b("#video_subtemplate").html();
                                        this.$upload_list_template = b("#video_upload_list_subtemplate").html();
                                        this.$upload_tos_template = b("#upload_tos_subtemplate").html();
                                        b.each(Tumblr.video_regexes, b.proxy(function (d, c) {
                                            this.recognized_patterns.push({
                                                exp: new RegExp("(?:^|\\s+|.*['\"=])((?:https?://)?(?:[^/]+\\.)?" + d + ")", "i"),
                                                service: c
                                            })
                                        }, this));
                                        this.parse_embed_field = _.debounce(function (d) {
                                            var c = this.parse_embed_code(b(d.currentTarget).val());
                                            this.$valid_embed_code.val(c ? "1" : "");
                                            this.change();
                                            return c
                                        }, 750);
                                        this.model.on("change:upload_progress", this.upload_progress, this);
                                        this.model.on("change:upload_complete", this.upload_complete, this);
                                        this.model.on("change:upload_failed", this.file_errors, this);
                                        this.model.on("change:upload_file_error", this.file_errors, this);
                                        this.model.on("change:send_file", this.display_file_list, this);
                                        this.model.on("change:upload_file_seppuku", this.refresh_upload_selector, this);
                                        this.$post_form.on("click", ".dismiss_preview", _.bind(function (c) {
                                            c.preventDefault();
                                            this.dismiss_preview()
                                        }, this));
                                        this.$post_form.on("click", "#file_list .cancel", _.bind(this.dismiss_upload, this));
                                        this.model.on("post:form:animation:hide", b.proxy(function (c) {
                                            this.destroy_preview()
                                        }, this))
                                    },
                                    render_view: function (e) {
                                        var d = _.template(this.$sub_template);
                                        this.$post_content_type.html(d(_.extend(_.clone(this.template_helpers), this.model.toJSON())));
                                        this.editor();
                                        this.cache_selectors_view();
                                        this.messages = this.$video_preview_container.find(".message").data();
                                        this.post = this.model.get("post");
                                        if (b.browser.safari && (!/chrome/.test(navigator.userAgent.toLowerCase()))) {
                                            this.$video_file_input.attr("accept", "")
                                        }
                                        if (b.browser.webkit && (/chrome/.test(navigator.userAgent.toLowerCase()))) {
                                            this.$video_file_input.attr("accept", ".mp4,.mov,.wmv,video/*")
                                        } else {
                                            if (b.browser.mozilla) {
                                                this.$video_file_input.attr("accept", "video/*")
                                            } else {
                                                this.$video_file_input.attr("accept", "")
                                            }
                                        }
                                        var c = _.template(this.$upload_tos_template);
                                        this.$main_content.after(c({}));
                                        this.$tos_container = b("#upload_tos").hide();
                                        this.$confirm_tos = b("#confirm_tos");
                                        if (typeof Tumblr.video_seconds_remaining === "number") {
                                            this.$video_upload.find(".video_time_remaining").text(_V_.formatTime(Tumblr.video_seconds_remaining))
                                        }
                                        this.$post_one.autoexpand({
                                            minHeight: 120
                                        }).resizeanchor();
                                        if (_.isEmpty(this.post)) {
                                            this.hide_editors()
                                        }
                                        if (this.model.get("reblog") || (this.model.get("edit") && !this.post.is_direct_video && !this.post.is_reblog)) {} else {
                                            this.$(".autofocus").focus();
                                            this.model.init_uploader(this.$video_file_input, {
                                                error_msg: {
                                                    errorSize: "File is too big. Max 100MB.",
                                                    errorType: "Only video files are allowed.",
                                                    errorTime: "Video is too long. Must be 5 minutes or less."
                                                }
                                            })
                                        }
                                        Tumblr.Editor.on("tinymce.focus", this.editor_focus, this);
                                        Tumblr.PlaceHolders.init({
                                            clear_on_submit: true
                                        });
                                        this.$pre_upload.val("");
                                        if (this.model.get("edit") || this.model.get("reblog")) {
                                            if (this.post.is_direct_video) {
                                                this.model.on("post:form:animation:start", function () {
                                                    this.render_preview(b.extend({}, this.post.video, {
                                                        width: this.post.video.dimensions_dashboard.width,
                                                        height: this.post.video.dimensions_dashboard.height,
                                                        embed_code_safe: this.post.video.embed_code
                                                    }));
                                                    if (this.post.is_reblog) {
                                                        this.$video_preview_container.addClass("reblog");
                                                        this.$(".dismiss_preview").remove()
                                                    }
                                                }, this)
                                            } else {
                                                this.model.on("post:form:animation:start", function () {
                                                    if (!this.post.video_embed.service && this.post.video_safe_iframe) {
                                                        this.post.video_embed.embed_code = this.post.video_safe_iframe
                                                    }
                                                    this.$valid_embed_code.val("1");
                                                    this.render_preview(this.post.video_embed);
                                                    if (this.post.is_reblog) {
                                                        this.$video_preview_container.addClass("reblog");
                                                        this.$(".dismiss_preview").remove()
                                                    }
                                                }, this)
                                            }
                                        }
                                        if (typeof e === "function") {
                                            e()
                                        }
                                        return this
                                    },
                                    cache_selectors_view: function () {
                                        this.$video_options_container = this.$("#video_options_container");
                                        this.$video_options = this.$(".video_option");
                                        this.$video_upload = this.$("#video_upload");
                                        this.$video_embed = this.$("#video_embed");
                                        this.$post_one = this.$("#post_one");
                                        this.$main_content = b(".main_content");
                                        this.$video_caption = this.$("#video_caption");
                                        this.$tag_editor = b(".tag_editor");
                                        this.$file_list = this.$("#file_list");
                                        this.$video_f...lse
                                    }
                                    this.render_preview(c);
                                    this.$valid_embed_code.val(c ? "1" : "");
                                    this.change();
                                    return true
                                }, render_preview: function (e) {
                                    e = b.extend({
                                        width: "500",
                                        height: "281",
                                        orig_embed_code: "",
                                        url: "",
                                        service: ""
                                    }, e);
                                    this.$input_caption.blur();
                                    this.destroy_preview();
                                    var c = b("#video_preview_subtemplate");
                                    if (!c) {
                                        return false
                                    }
                                    var d = _.template(c.html());
                                    this.$video_preview = b(d(_.extend(_.clone(this.template_helpers), e)));
                                    this.$video_preview_container.prepend(this.$video_preview);
                                    this.$video_preview_container.addClass("player");
                                    this.$video_options_container.hide();
                                    this.show_editors(true);
                                    return true
                                }, show_editors: function (c) {
                                    this.$video_caption.show();
                                    this.$tag_editor.show();
                                    if (c) {
                                        this.$post_one.focus()
                                    }
                                }, hide_editors: function () {
                                    this.$video_caption.hide();
                                    this.$tag_editor.hide()
                                }, destroy_local_player: function () {
                                    if (this.preview_player) {
                                        this.preview_player.destroy();
                                        delete this.preview_player
                                    }
                                    if (this.$local_preview) {
                                        this.$local_preview.remove();
                                        delete this.$local_preview
                                    }
                                }, destroy_preview: function () {
                                    this.destroy_local_player();
                                    this.$video_preview_container.removeClass("player");
                                    this.$video_preview.remove();
                                    this.$video_preview = b()
                                }, destroy_upload: function () {
                                    this.$video_upload_container.remove();
                                    this.$main_content.removeClass("video_upload");
                                    this.$video_upload_container = this.$file_list = b();
                                    this.$progress_bar = this.$processing = b()
                                }, dismiss_preview: function () {
                                    this.$("#keep_video").val("");
                                    this.$post_one.val("");
                                    this.$valid_embed_code.val("");
                                    this.destroy_preview();
                                    this.$video_preview_container.removeClass("player loading loaded failed unavailable");
                                    this.$video_options_container.removeClass("no_upload").show();
                                    if (_.isEmpty(this.post)) {
                                        this.hide_editors()
                                    }
                                    this.$preuploaded_url.val("");
                                    this.$pre_upload.val("");
                                    this.$tos_container.hide();
                                    this.$confirm_tos.prop("checked", "");
                                    this.change();
                                    this.$input_caption.focus()
                                }, display_file_list: function (f, c) {
                                    this.local_file = f[0];
                                    this.$pre_upload.val("1");
                                    this.$confirm_tos.prop("checked", "");
                                    this.hide_errors();
                                    var d = {
                                        name: f[0].name,
                                        prettySize: Tumblr.$.format_file_size(f[0].size),
                                        className: c
                                    };
                                    this.$video_upload_container.remove();
                                    var e = _.template(this.$upload_list_template);
                                    this.$video_upload_container = b(e(_.extend(_.clone(this.template_helpers), d)));
                                    this.$file_list = this.$video_upload_container.find("#file_list");
                                    this.$progress_bar = this.$video_upload_container.find(".progress_bar");
                                    this.$processing = this.$video_upload_container.find(".processing");
                                    this.$main_content.before(this.$video_upload_container);
                                    this.initiate_upload()
                                }, file_errors: function (c) {
                                    this.$video_upload_container.addClass("error");
                                    this.$processing.removeClass("active");
                                    this.display_errors(c)
                                }, initiate_upload: function () {
                                    this.destroy_preview();
                                    this.$main_content.addClass("video_upload");
                                    this.$video_options_container.hide();
                                    this.show_editors(true);
                                    this.$file_list.show();
                                    this.$tos_container.show();
                                    this.hide_errors()
                                }, upload_progress: function (c) {
                                    this.$progress_bar.css({
                                        width: c + "%"
                                    });
                                    if (c > 99) {
                                        this.$processing.addClass("active")
                                    }
                                }, upload_complete: function (c) {
                                    this.$processing.removeClass("active");
                                    this.display_title = this.local_file.name;
                                    if (!c.errors || !c.errors.length) {
                                        this.$video_upload_container.addClass("success");
                                        this.$preuploaded_url.val(c.response[0].key);
                                        this.$preuploaded_ch.val(c.response[0].ch);
                                        if (c.response[0].duration) {
                                            this.display_title += " (" + _V_.formatTime(c.response[0].duration) + ")"
                                        }
                                    } else {
                                        this.$file_list.addClass("error");
                                        this.file_errors(c.errors);
                                        this.cancel_upload();
                                        return false
                                    }
                                    this.change();
                                    this.destroy_upload();
                                    if (!(window.FileReader && window.URL && window.URL.createObjectURL)) {
                                        this.$video_preview_container.addClass("unavailable").find(".message").text(this.display_title || this.messages.unavailable)
                                    } else {
                                        c.width = c.response[0].width || 500;
                                        c.height = c.response[0].height || 281;
                                        c.height = Math.round(500 / c.width * c.height);
                                        c.width = 500;
                                        this.render_preview({
                                            service: "local",
                                            embed_code: "",
                                            width: c.width,
                                            height: c.height
                                        });
                                        this.$local_preview = b("<video/>", {
                                            id: "video_local_preview",
                                            "class": "video-js vjs-default-skin",
                                            controls: true,
                                            "data-setup": "{}"
                                        });
                                        b("#watch_video_post_preview").append(this.$local_preview);
                                        this.preview_player = new Tumblr.VideoPlayer({
                                            file: this.local_file,
                                            video_id: "video_local_preview",
                                            auto_height: false,
                                            on_file_load: _.bind(function (f, d) {
                                                this.$local_preview = d.$el;
                                                this.$local_preview.attr({
                                                    width: "",
                                                    height: ""
                                                }).css({
                                                    width: "",
                                                    height: ""
                                                });
                                                this.$local_preview.addClass("retro_video_preview");
                                                d.$tag.after('<div class="retro_fuzz"></div>');
                                                b("#video_preview_post_preview").hide();
                                                b("#watch_video_post_preview").show()
                                            }, this),
                                            on_error: _.bind(function (f, d) {
                                                this.$video_preview_container.removeClass("player").addClass("unavailable").find(".message").text(this.display_title || this.messages.unavailable);
                                                this.destroy_preview()
                                            }, this)
                                        })
                                    }
                                }, dismiss_upload: function (c) {
                                    this.cancel_upload(c);
                                    this.$post_one.val("");
                                    this.hide_errors()
                                }, cancel_upload: function (c) {
                                    if (c) {
                                        c.preventDefault()
                                    }
                                    this.model.cancel_upload();
                                    this.destroy_upload();
                                    this.hide_editors();
                                    this.$file_upload.show();
                                    this.$tos_container.hide();
                                    this.$video_options_container.show()
                                }
                            })
                    })(jQuery, Tumblr);
                (function (b, a) {
                    Tumblr.PostForms.RenderPost = Backbone.View.extend({
                        load_newer_posts: function (i, e) {
                            var h = b("#new_post_buttons").next().find(".post");
                            var d = h.length ? h.data("post-id") : 0;
                            var g = "/svc/post" + e + "/before/" + d;
                            var c = b("body").scrollTop();
                            var f = b("#container").height();
                            this.render_posts(g, b("#new_post, #flash_notifications").last().parent("li"), function (m, k) {
                                if (typeof i === "number") {
                                    b("html, body").animate({
                                        scrollTop: i
                                    }, 250)
                                } else {
                                    if (typeof i === "object") {
                                        var p = i.offset();
                                        b("html, body").animate({
                                            scrollTop: p.top
                                        }, 250)
                                    } else {
                                        if (i) {
                                            var l = b("#container").height();
                                            var j = l - f;
                                            var o = c + j;
                                            b("html, body").animate({
                                                scrollTop: o
                                            }, 0)
                                        }
                                    }
                                }
                                Tumblr.Events.trigger("posts:load");
                                if (window._gaq !== undefined) {
                                    try {
                                        _gaq.push(["_trackPageview", e])
                                    } catch (n) {}
                                }
                                try {
                                    if (window._qevents && window.__qc) {
                                        __qc.qpixelsent = [];
                                        _qevents.push({
                                            qacct: "p-19UtqE8ngoZbM"
                                        })
                                    }
                                } catch (n) {}
                            }, function (j) {
                                j.find('[name="redirect_to"]').val(e);
                                j.find(".post_controls a.post_control").each(function (l, k) {
                                    b(k).attr("href", b(k).attr("href").replace(/([\?\&]redirect_to=)([^?&]+)/i, "$1" + encodeURIComponent(e)))
                                })
                            });
                            return this
                        },
                        render_posts: function (c, e, f, d) {
                            b.ajax({
                                url: c,
                                type: "get",
                                success: function (h) {
                                    var g = b(b.trim(h));
                                    if (typeof d === "function") {
                                        d.apply(this, [g])
                                    }
                                    g.insertAfter(e);
                                    if (g.filter(".post").length) {
                                        b(".no_posts_found").remove()
                                    }
                                    if (Tumblr.AudioPlayer) {
                                        _.delay(function () {
                                            Tumblr.AudioPlayer.replace_placeholders(g, true)
                                        }.bind(this), 750)
                                    }
                                    if (typeof f === "function") {
                                        return f.apply(this, [h, g])
                                    }
                                    b("html, body").animate({
                                        scrollTop: 0
                                    }, 250)
                                },
                                error: function () {
                                    window.location.reload()
                                }
                            });
                            return this
                        },
                        render: function () {
                            var f = b("#new_post").parent("li").nextAll("li .post").first();
                            var c = f.length ? f.data("id") : 0;
                            var d = this.page_root || window.location.pathname.split("?")[0].replace(/\/$/, "");
                            var e = "/svc/post" + d + "/before/" + c;
                            b.ajax({
                                url: e,
                                type: "get",
                                success: function (h) {
                                    var g = b(h);
                                    g.find('[name="redirect_to"]').val(d);
                                    g.find(".post_controls a.post_control").each(function (k, j) {
                                        b(j).attr("href", b(j).attr("href").replace(/([\?\&]redirect_to=)([^?&]+)/i, "$1" + encodeURIComponent(d)))
                                    });
                                    b("#new_post, #flash_notifications").last().parent("li").after(g);
                                    b("html, body").animate({
                                        scrollTop: 0
                                    }, 250);
                                    if (window._gaq !== undefined) {
                                        try {
                                            _gaq.push(["_trackPageview", d])
                                        } catch (i) {}
                                    }
                                    if (window._qevents) {
                                        try {
                                            _qevents.push({
                                                event: "ajax",
                                                qacct: "p-19UtqE8ngoZbM"
                                            })
                                        } catch (i) {}
                                    }
                                },
                                error: function () {
                                    window.location.reload()
                                }
                            });
                            return this
                        }
                    })
                })(jQuery, Tumblr);
                (function (c, b) {
                    var a = Backbone.View.extend({
                        events: {
                            focus: "focus",
                            click: "focus",
                            "keydown .editor": "keydown",
                            "keyup .editor": "keyup",
                            "click .tag": "remove_tag",
                            "click #tag_suggest a": "__click_popover_tags",
                            "mouseenter #tag_suggest a": "__mouseenter_popover_tags",
                            "mouseleave #tag_suggest a": "__mouseleave_popover_tags"
                        },
                        initialize: function () {
                            this.$editor_wrapper = this.$(".editor_wrapper");
                            this.$editor = this.$(".editor");
                            this.$post_tags = this.$(".post_tags");
                            this.endpoint = this.options.endpoint || "/svc/tag_suggest/";
                            this.store = Tumblr.USER_TAGS || [];
                            this.threshold = 2;
                            this.limit = 5;
                            this.visible = false;
                            this.cache = {};
                            this.popover = this.$("#tag_suggest");
                            this.form_key = c("#tumblr_form_key").attr("content");
                            this.keyevents = {
                                bind_key_down: _.bind(this.document_keydown, this)
                            };
                            this.outside_events = {
                                click: _.bind(this.__outside_click_focus, this),
                                focus: _.bind(this.__outside_click_focus, this)
                            };
                            c(document).on("click", this.outside_events.click);
                            c(document).on("focus", this.outside_events.focus);
                            document.addEventListener("tinymce.focus", this.outside_events.focus, this);
                            this.render()
                        },
                        __outside_click_focus: function (f) {
                            var d = c(f.currentTarget);
                            if (!d.is("#tag_suggest a") && this.$editor.val()) {
                                this.update(this.$editor.val())
                            }
                            this.hide_popover()
                        },
                        __click_popover_tags: function (f) {
                            var d = c(f.currentTarget);
                            var g = d.text();
                            this.update(g);
                            this.popover.hide();
                            f.stopPropagation();
                            f.preventDefault();
                            this.focus()
                        },
                        __mouseenter_popover_tags: function (f) {
                            if (this.focused_item) {
                                this.focused_item.blur()
                            }
                            var d = c(f.currentTarget);
                            d.focus()
                        },
                        __mouseleave_popover_tags: function (f) {
                            var d = c(f.currentTarget);
                            d.blur()
                        },
                        _escapeRegExp: function (d) {
                            return d.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\~\`\!\@\#]/g, "\\$&")
                        },
                        hide_popover: function () {
                            if (this.popover) {
                                this.popover.hide();
                                this.visible = false
                            }
                            this.unbind_key_nav()
                        },
                        show_popover: function () {
                            if (this.popover) {
                                this.popover.show();
                                this.visible = true
                            }
                            this.bind_key_nav()
                        },
                        destroy: function () {
                            this.undelegateEvents();
                            c(document).off("click", this.outside_events.click);
                            c(document).off("focus", this.outside_events.focus);
                            document.removeEventListener("tinymce.focus", this.outside_events.focus, this)
                        },
                        next: function () {
                            this.$editor.blur();
                            this.currentIndex++;
                            this.set_active("next")
                        },
                        previous: function () {
                            this.$editor.blur();
                            this.currentIndex--;
                            this.set_active("previous")
                        },
                        set_active: function (f) {
                            var d = c("#tag_suggest a");
                            var e = d.filter(":focus");
                            if (e.length) {
                                this.currentIndex = (f === "next") ? d.index(e) + 1 : d.index(e) - 1
                            }
                            if (this.currentIndex >= 0 && this.currentIndex < d.length) {
                                this.focused_item = d.get(this.currentIndex);
                                this.focused_item.focus()
                            } else {
                                if (f === "next") {
                                    this.focused_item = d.get(0);
                                    this.focused_item.focus()
                                } else {
                                    this.currentIndex = -1;
                                    this.$editor.focus()
                                }
                            }
                        },
                        bind_key_nav: function () {
                            c(document).off("keydown", this.keyevents.bind_key_down);
                            c(document).on("keydown", this.keyevents.bind_key_down)
                        },
                        unbind_key_nav: function () {
                            c(document).off("keydown", this.keyevents.bind_key_down)
                        },
                        render: function () {
                            var e = [];
                            var f = this.$post_tags.val();
                            var d;
                            e = _.map(f.split(","), function (g) {
                                return c.trim(g)
                            });
                            _.each(e, _.bind(function (g) {
                                this.update(g)
                            }, this))
                        },
                        focus: function () {
                            this.currentIndex = -1;
                            this.$editor.focus()
                        },
                        keydown: function (g) {
                            if (!g) {
                                g = window.event
                            }
                            var f = g.charCode ? g.charCode : g.keyCode;
                            if (f === 8 && !this.$editor.val()) {
                                var d = this.$(".tag");
                                if (d.length && d[d.length - 1]) {
                                    d.last().remove();
                                    this.update_form()
                                }
                            } else {
                                if (f === 13 || ((f === 188) && !g.shiftKey)) {
                                    g.preventDefault();
                                    g.stopPropagation();
                                    this.update(this.$editor.val())
                                } else {
                                    if (f === 27 && this.$editor.val()) {
                                        g.preventDefault();
                                        g.stopPropagation();
                                        this.update(this.$editor.val())
                                    } else {
                                        if (f === 9 && this.$editor.val() && c("#tag_suggest a").filter(":visible")) {
                                            g.preventDefault();
                                            g.stopPropagation();
                                            this.next()
                                        }
                                    }
                                }
                            }
                            this.$editor.attr("size", this.$editor.val().length || 5)
                        },
                        document_keydown: function (d) {
                            switch (d.keyCode) {
                            case 27:
                                d.preventDefault();
                                d.stopPropagation();
                                d.originalEvent.stopImmediatePropagation();
                                this.hide_popover();
                                return;
                            case 38:
                                d.preventDefault();
                                this.previous();
                                break;
                            case 40:
                                d.preventDefault();
                                this.next();
                                break;
                            default:
                                break
                            }
                        },
                        keyup: _.throttle(function (d) {
                            this.lookup()
                        }, 50),
                        prepare_search_data: function () {
                            return {
                                q: this.search_query_raw,
                                form_key: this.form_key
                            }
                        },
                        get_store: function (d) {
                            if (this.store_cache) {
                                this.results = this.store_cache;
                                d.call(this);
                                return
                            }
                            if (this.store_xhr) {
                                this.store_xhr.abort()
                            }
                            this.store_xhr = c.ajax({
                                url: "/svc/tags/featured",
                                dataType: "json"
                            });
                            this.store_xhr.done(_.bind(function (e) {
                                this.results = e;
                                this.store_cache = e;
                                if (typeof d === "function") {
                                    d.call(this)
                                }
                            }, this))
                        },
                        get_search_results: function (d) {
                            d = d || function () {};
                            if (this.cache[this.search_query]) {
                                this.results = this.cache[this.search_query];
                                d.call(this);
                                return
                            }
                            this.search_in_progress = true;
                            this.results = {
                                tags: {}
                            };
                            this.store_xhr = c.ajax({
                                url: this.endpoint,
                                data: this.prepare_search_data(),
                                dataType: "json",
                                method: "post"
                            });
                            this.store_xhr.success(_.bind(function (e) {
                                this.results = e;
                                this.add_to_cache(this.search_query, e)
                            }, this));
                            this.store_xhr.error(_.bind(function (e) {}, this));
                            this.store_xhr.complete(_.bind(function (e) {
                                this.search_in_progress = false;
                                d.call(this)
                            }, this))
                        },
                        lookup: function () {
                            var f = c.trim(this.$editor.val());
                            var g = f.length;
                            var e;
                            var d;
                            var h;
                            if (g >= this.threshold && !this.init && f !== this.init_value) {
                                this.search_query = _.escape(f);
                                this.search_query_raw = f;
                                if (!Tumblr.use_search_endpoint) {
                                    this.get_store(_.bind(function () {
                                        e = this.filter(this.store, f);
                                        d = this.filter(this.results, f);
                                        this.suggest(e, d)
                                    }, this))
                                } else {
                                    this.get_search_results(_.bind(function () {
                                        e = this.filter(this.store, f);
                                        var i = _.compact(_.map(this.results.tags, function (k, j) {
                                            if (_.indexOf(e, k.tag) === -1) {
                                                return k
                                            }
                                        }, this));
                                        this.suggest(e, i)
                                    }, this))
                                }
                            } else {
                                this.suggest([])
                            }
                            this.init = false;
                            this.init_value = ""
                        },
                        add_to_cache: function (d, e) {
                            this.cache[d] = e;
                            if (_.size(this.cache) > this.cache_size) {
                                delete this.cache[this.queries[0]];
                                this.queries.shift()
                            }
                        },
                        inject_search_substring: function (d, f) {
                            if (!this.search_query) {
                                return
                            }
                            var e = new RegExp(this._escapeRegExp(this.search_query), "gi"),
                                g = this.decorate_search_substring;
                            if (!e) {
                                return
                            }
                            _.each(d, function (j, h) {
                                if (f === "user_tag") {
                                    d[h] = j.replace(e, g)
                                }
                                if (f === "suggestion") {
                                    d[h].hilite_tag = j.tag.replace(e, g)
                                }
                            });
                            return d
                        },
                        decorate_search_substring: function (d) {
                            return "<u>" + d + "</u>"
                        },
                        suggest: function (d, h) {
                            if (d.length || (h && h.length)) {
                                this.show_popover();
                                var f = _.template(c("#tag_suggest_subtemplate").html());
                                if (!Tumblr.use_search_endpoint) {
                                    this.$("#tag_suggest .popover_inner").html(f(_.extend({
                                        user_tags: d.sort(),
                                        suggested_tags: h
                                    }, this.template_helpers)))
                                } else {
                                    var e = this.inject_search_substring(d, "user_tag");
                                    var g = this.inject_search_substring(h, "suggestion");
                                    this.$("#tag_suggest .popover_inner").html(f(_.extend({
                                        user_tags: e.sort().slice(0, this.limit),
                                        suggested_tags: g.slice(0, this.limit)
                                    }, this.template_helpers)))
                                }
                            } else {
                                this.hide_popover()
                            }
                        },
                        remove_tag: function (d) {
                            c(d.currentTarget).remove();
                            this.update_form()
                        },
                        update: function (d) {
                            d = d.replace(/[",#]/g, "").replace(/</g, "&lt;");
                            d = Tumblr.$.truncate(c.trim(d), 140);
                            if (d.replace(/,/g, "")) {
                                this.$editor.val("");
                                var g = false;
                                var e = this.$(".tag");
                                if (e.length) {
                                    _.each(e, function (h) {
                                        if (d === c(h).text()) {
                                            g = true
                                        }
                                    })
                                }
                                if (!g) {
                                    var f = c("<span/>", {
                                        "class": "tag",
                                        text: d
                                    });
                                    this.$editor_wrapper.before(f);
                                    this.update_form();
                                    if (!_.contains(Tumblr.USER_TAGS, d)) {
                                        Tumblr.USER_TAGS.push(d)
                                    }
                                }
                            }
                        },
                        update_form: function () {
                            var d = [];
                            _.each(this.$(".tag"), function (e) {
                                d.push(c(e).text())
                            });
                            this.$post_tags.val(d.join(","))
                        },
                        escapeRegex: function (d) {
                            return d.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
                        },
                        filter: function (f, e) {
                            var d = new RegExp(this.escapeRegex(e), "i");
                            return c.grep(f, function (g) {
                                return d.test(g.tag || g)
                            })
                        }
                    });
                    b.TagEditor = a
                })(jQuery, Tumblr);
                (function (c, a) {
                    var b = Backbone.View.extend({
                        custom_tweet: false,
                        services: ["facebook", "twitter"],
                        init: true,
                        events: {
                            "keyup #custom_tweet": "tweet_length",
                            "click #custom_tweet": "tweet_length",
                            "keyup .main_content input": "change",
                            "keyup .main_content textarea": "change",
                            "blur .main_content input": "change",
                            "blur .main_content textarea": "change",
                            "change .main_content textarea": "change",
                            "change .main_content input": "change",
                            "change .share_btns label": "toggle_share",
                            "mouseenter .share_btns .twitter": "mouseenter",
                            "mouseleave .share_btns .twitter": "mouseleave",
                            "click #tweet_popover .dismiss": "dismiss_tweet"
                        },
                        initialize: function () {
                            this.states = {};
                            this.$custom_tweet = this.$("#custom_tweet");
                            this.$tweet_length = this.$("#tweet_popover .length");
                            this.$tweet_popover = this.$("#tweet_popover");
                            this.$twitter_label = this.$(".twitter");
                            this.$facebook_label = this.$(".facebook");
                            this.$twitter_cb = this.$('.twitter input[type="checkbox"]');
                            this.$facebook_cb = this.$('.facebook input[type="checkbox"]');
                            this.post_type = this.options.post_type || "regular";
                            this.post_markdown = (this.options.editor_type === "markdown") ? true : false;
                            Tumblr.Editor.on("tinymce.change", this.change, this);
                            b.register(this)
                        },
                        cache_form_elements: function () {
                            this.$post_one = this.$("#post_one");
                            this.$post_two = this.$("#post_two");
                            this.$post_three = this.$("#post_three")
                        },
                        change: function (d) {
                            if (this.custom_tweet) {
                                return
                            }
                            this.$custom_tweet.val(this.tweet_summary())
                        },
                        destroy: function () {
                            this.undelegateEvents();
                            this.states = {};
                            Tumblr.Editor.off("tinymce.change", null, this);
                            b.instances.splice(_.indexOf(this), 1)
                        },
                        mouseenter: function (f) {
                            f.preventDefault();
                            var d = c(f.currentTarget);
                            if (!d.hasClass("checked") || (Tumblr.MultiPopover.visible())) {
                                return
                            }
                            this.display_popover()
                        },
                        mouseleave: function () {
                            clearTimeout(this.appear_delay);
                            if (this.popover && !Tumblr.MultiPopover.visible()) {
                                if (!this.popover.visible) {
                                    this.popover.hide()
                                }
                            }
                        },
                        display_popover: function () {
                            this.appear_delay = setTimeout(_.bind(function () {
                                if (!this.popover) {
                                    this.popover = new Tumblr.MultiPopover(this.$tweet_popover.get(0), {
                                        token: "post-plexi",
                                        on_show: _.bind(function () {
                                            this.$twitter_label.addClass("active")
                                        }, this),
                                        on_hide: _.bind(function () {
                                            this.$twitter_label.removeClass("active")
                                        }, this)
                                    }).show()
                                } else {
                                    this.popover.show()
                                }
                            }, this), 200)
                        },
                        dismiss_tweet: function () {
                            this.popover.hide();
                            clearTimeout(this.appear_delay)
                        },
                        toggle_share: function (h) {
                            var d = c(h.currentTarget);
                            var g = d.parent("li");
                            g.toggleClass("checked");
                            var f = g.data("share");
                            if (!g.hasClass("checked")) {
                                this.states[f] = "off";
                                if (this.popover) {
                                    this.popover.hide()
                                }
                            } else {
                                if (g.hasClass("twitter")) {
                                    this.display_popover()
                                }
                                this.states[f] = "on"
                            }
                        },
                        set_caret: function (g) {
                            var f = c(g);
                            var h = 0;
                            var d = f.val().indexOf("[URL]") - 1;
                            if (d < h) {
                                f.val(" " + f.val());
                                d = 1
                            }
                            if (g.setSelectionRange) {
                                g.focus();
                                g.setSelectionRange(h, d)
                            } else {
                                if (g.createRange) {
                                    var e = g.createRange();
                                    e.setStart("character", h);
                                    e.setEnd("character", d);
                                    e.select()
                                } else {
                                    f.focus()
                                }
                            }
                        },
                        strip_html: function (h) {
                            if (!h) {
                                return h
                            }
                            try {
                                var f = document.implementation.createHTMLDocument("");
                                f.body.innerHTML = Tumblr.$.strip_scripts(h);
                                var g = f.body.textContent || f.body.innerText;
                                return this.normalize_space(c.trim(g))
                            } catch (d) {
                                return this.normalize_space(c.trim(Tumblr.$.strip_scripts(Tumblr.$.strip_tags(h))))
                            }
                        },
                        normalize_space: function (d) {
                            return c.trim(d).replace("\u00A0", " ").replace(/\s\s+/, " ")
                        },
                        parse_url: function (e, f) {
                            var g = ["source", "scheme", "authority", "userInfo", "user", "pass", "host", "port", "relative", "path", "directory", "file", "query", "fragment"];
                            var d = g.indexOf(f);
                            if (d < 0) {
                                return false
                            }
                            return (/^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/).exec(e)[d] || ""
                        },
                        tweet_summary: function () {
                            this.process(this.post_type);
                            var e = "";
                            var f = " [URL]";
                            var g = 140 - 30;
                            var d = "";
                            switch (this.post_type) {
                            case "regular":
                            case "conversation":
                                d = (this.post_one && this.post_two) ? this.post_one + " - " + this.post_two : (this.post_one ? this.post_one : this.post_two);
                                break;
                            case "photo":
                            case "video":
                            case "audio":
                                d = this.post_two;
                                break;
                            case "note":
                                d = this.post_one;
                                break;
                            case "link":
                                if (this.post_one && this.post_three) {
                                    d = this.post_one + " - " + this.post_three
                                } else {
                                    if (this.post_one) {
                                        d = this.post_one
                                    } else {
                                        if (this.post_three) {
                                            d = this.post_three
                                        } else {
                                            d = this.parse_url(this.post_two, "host")
                                        }
                                    }
                                }
                                break;
                            case "quote":
                                var h = Tumblr.$.truncate(this.post_one, g - 5, "\u2026");
                                d = "\u201c" + h + "\u201d";
                                if (h == this.post_one && this.post_two && d.length < (g - 5)) {
                                    d += " - " + this.post_two
                                }
                                break;
                            default:
                                break
                            }
                            if (!d) {
                                f = c.trim(f);
                                d = ""
                            }
                            return e + Tumblr.$.truncate(d, g, "\u2026") + f
                        },
                        tweet_length: function (j) {
                            if (this.init) {
                                this.set_caret(j.target)
                            }
                            switch (j.keyCode) {
                            case 17:
                            case 18:
                            case 27:
                            case 33:
                            case 34:
                            case 35:
                            case 36:
                            case 37:
                            case 38:
                            case 39:
                            case 40:
                            case 91:
                            case 93:
                                return false;
                            default:
                                break
                            }
                            var i = this.$custom_tweet.scrollTop();
                            this.init = false;
                            this.custom_tweet = true;
                            var h = this.$custom_tweet.val();
                            var d = h.match("[URL]");
                            var g = (d) ? 24 : 0;
                            var f = 140 - h.length - g;
                            if (f < 1) {
                                if (d) {
                                    if (h.match(/ \[URL\]$/)) {
                                        h = h.replace(/ \[URL\]$/, "");
                                        h = Tumblr.$.truncate(h, 140 - g, "\u2026");
                                        h += " [URL]"
                                    } else {
                                        h = Tumblr.$.truncate(h, 140 - g, "\u2026")
                                    }
                                } else {
                                    h = Tumblr.$.truncate(h, 140, "\u2026")
                                }
                                f = 0
                            }
                            this.$custom_tweet.val(h);
                            this.$tweet_length.text(f);
                            this.$tweet_length.addClass("active");
                            if (d && f === 0 && this.$custom_tweet.setSelectionRange) {
                                this.$custom_tweet.setSelectionRange(h.indexOf("[URL]") - 1, h.indexOf("[URL]") - 1)
                            }
                            this.$custom_tweet.scrollTop(i)
                        },
                        process: function (d) {
                            if (!d) {
                                return
                            }
                            this.cache_form_elements();
                            switch (d) {
                            case "conversation":
                                this.post_one = this.strip_html(this.$post_one.val());
                                this.post_two = this.strip_html(this.$post_two.val());
                                this.post_three = "";
                                break;
                            case "quote":
                                this.post_one = this.process_quote(this.process_html(this.$post_one.val()), ["\u201c", "\u201d"], true, true);
                                this.post_two = this.strip_html(this.process_html(this.$post_two.val()), ["\u2014"], true, false);
                                this.post_three = "";
                                break;
                            case "regular":
                            case "photo":
                                this.post_one = this.strip_html(this.$post_one.val());
                                this.post_two = this.strip_html(this.process_html(this.$post_two.val()));
                                this.post_three = "";
                                break;
                            case "link":
                                this.post_one = this.strip_html(this.$post_one.val());
                                this.post_two = this.strip_html(this.$post_two.val());
                                this.post_three = this.strip_html(this.process_html(this.$post_three.val()));
                                break;
                            case "audio":
                                this.post_one = this.strip_html(this.$post_one.val());
                                this.post_two = this.strip_html(this.process_html(this.$post_two.val()));
                                this.post_three = this.strip_html(this.$post_three.val());
                                break;
                            case "video":
                                this.post_one = this.strip_html(this.$post_one.val());
                                this.post_two = this.strip_html(this.process_html(this.$post_two.val()));
                                this.post_three = "";
                                break;
                            default:
                                break
                            }
                        },
                        process_html: function (g) {
                            g = c.trim(g);
                            if (this.post_markdown) {
                                try {
                                    var d = new Markdown.Converter();
                                    g = d.makeHtml(g)
                                } catch (f) {}
                            }
                            return g
                        },
                        process_quote: function (g, f, e, d) {
                            g = c.trim(g);
                            if (e) {
                                while (g && f.indexOf(g.substring(0, 1)) !== -1) {
                                    g = g.substring(1)
                                }
                            }
                            if (d) {
                                while (g && f.indexOf(g.substring(g.length - 1, g.length)) !== -1) {
                                    g = g.substring(0, g.length - 1)
                                }
                            }
                            return c.trim(g)
                        },
                        set_sharing: function (d) {
                            _.each(this.services, _.bind(function (e) {
                                if (d[e]) {
                                    if (d[e + "On"] || this.states[e] === "on") {
                                        this.set_share(e, true)
                                    } else {
                                        this.clear_share(e)
                                    }
                                } else {
                                    this.clear_share(e, true)
                                }
                            }, this))
                        },
                        set_share: function (g, d) {
                            var f = this.$("." + g).show();
                            var e = this.$("." + g + " input");
                            if (d) {
                                if (this.states[g] !== "off") {
                                    f.addClass("checked");
                                    e.attr("checked", true)
                                }
                            } else {
                                f.removeClass("checked");
                                e.attr("checked", false)
                            }
                        },
                        clear_share: function (g, e) {
                            var f = this.$("." + g).removeClass("checked").show();
                            var d = this.$("." + g + " input").attr("checked", false);
                            if (e) {
                                f.hide()
                            }
                        },
                        clear_all: function () {
                            _.each(this.services, _.bind(function (d) {
                                this.clear_share(d, true)
                            }, this))
                        },
                        set_type: function (d) {
                            this.post_type = d
                        }
                    });
                    b.instances = [];
                    b.register = function (d) {
                        this.instances.push(d)
                    };
                    b.destroy_all = function () {
                        while (this.instances.length) {
                            this.instances[0].destroy()
                        }
                    };
                    a.ShareOptions = b
                })(jQuery, Tumblr);
                (function (b) {
                    var a = a || function (c) {
                            return c
                        };
                    Tumblr.VideoPlayer = Backbone.View.extend({
                        initialize: function () {
                            this.config = {
                                controls: true,
                                autoplay: false,
                                techOrder: ["html5"],
                                auto_height: true
                            };
                            this.playcount = 0;
                            if (b.isPlainObject(arguments[0])) {
                                this.config = b.extend(this.config, arguments[0]);
                                this.video_id = this.config.video_id
                            } else {
                                if (typeof arguments[0] === "string") {
                                    this.video_id = arguments[0];
                                    if (arguments.length > 1) {
                                        this.config = b.extend(this.config, arguments[1])
                                    }
                                }
                            }
                            this.video_player = _V_(this.video_id, this.config);
                            this.el = this.video_player.el;
                            this.tag = this.video_player.tag;
                            this.$el = b(this.el);
                            this.$tag = b(this.tag);
                            this.$el.addClass("tumblr_video_player video-js");
                            this.vjs_controls();
                            this.add_events();
                            if (this.config.file) {
                                this.load_file(this.config.file);
                                delete this.config.file
                            }
                            if (this.config.src) {
                                this.load_src(this.config.src)
                            }
                            return this
                        },
                        destroy: function () {
                            this.video_player.destroy()
                        },
                        vjs_controls: function () {
                            this.$video_controls = b("<div/>").addClass("tvp_controls").insertAfter(this.$tag);
                            this.$video_controls.append(this.$el.find(".vjs-big-play-button"), this.$el.find(".vjs-controls").addClass("tvp_controls_inner"), b('<div class="tvp_video_error"><div class="tvp_video_error_message">' + a("Video failed to load.") + "</div></div>"));
                            this.controls = {
                                big_play: this.$video_controls.find(".vjs-big-play-button"),
                                container: this.$video_controls.find(".vjs-controls"),
                                playpause: this.$video_controls.find(".vjs-play-control"),
                                fullscreen: this.$video_controls.find(".vjs-fullscreen-control"),
                                time_controls: this.$video_controls.find(".vjs-time-controls"),
                                current_time: this.$video_controls.find(".vjs-current-time"),
                                current_time_display: this.$video_controls.find(".vjs-current-time-display"),
                                remaining_time: this.$video_controls.find(".vjs-remaining-time"),
                                remaining_time_display: this.$video_controls.find(".vjs-remaining-time-display"),
                                load_progress: this.$video_controls.find(".vjs-load-progress"),
                                play_progress: this.$video_controls.find(".vjs-play-progress"),
                                seek_handle: this.$video_controls.find(".vjs-seek-handle"),
                                progress_control: this.$video_controls.find(".vjs-progress-control"),
                                progress_holder: this.$video_controls.find(".vjs-progress-holder"),
                                error: this.$video_controls.find(".tvp_video_error")
                            };
                            this.controls.big_play.hide();
                            this.controls.play = b("<div/>").addClass("tvp_play_button").html('<span class="vjs-control-text">' + a("Play") + "</span>");
                            this.controls.pause = b("<div/>").addClass("tvp_pause_button").html('<span class="vjs-control-text">' + a("Pause") + "</span>");
                            this.controls.playpause.empty().append(this.controls.play, this.controls.pause);
                            this.controls.progress_control.addClass("tvp_progress");
                            this.controls.progress_holder.addClass("tvp_progress_holder");
                            this.controls.load_progress.addClass("tvp_load_progress");
                            this.controls.play_progress.addClass("tvp_play_progress");
                            this.controls.seek_handle.addClass("tvp_seek_handle");
                            this.controls.current_time.addClass("tvp_current_time");
                            this.controls.remaining_time.addClass("tvp_remaining_time");
                            this.controls.time_display = b("<div/>").addClass("tvp_time_display").append(this.controls.time_controls);
                            this.controls.seek_thumbs = b("<b/>");
                            this.controls.seek_time = b("<i/>").text(_V_.formatTime(0));
                            this.controls.seek_thumbs_container = b("<div/>").addClass("tvp_seek_thumbs no_thumbs").append(this.controls.seek_thumbs, this.controls.seek_time);
                            this.controls.stretchy_middle = b("<div/>").addClass("tvp_stretchy_middle").prependTo(this.controls.container).append(this.controls.seek_thumbs_container, this.controls.progress_control, this.controls.time_display);
                            this.controls.time_hud = b("<div/>").addClass("tvp_time_hud");
                            this.controls.big_play.addClass("tvp_big_play_button").append(this.controls.time_hud);
                            this.set_duration();
                            this.controls.fullscreen.addClass("tvp_fullscreen_button").find(".vjs-control-text").text(a("Fullscreen"));
                            this.$video_controls.find(".vjs-time-divider").remove();
                            this.$el.find(".vjs-control").addClass("tvp_control");
                            this.spinner = new Spinner({
                                lines: 13,
                                length: 6,
                                width: 3,
                                radius: 10,
                                color: "#fff",
                                speed: 0.9,
                                trail: 34,
                                shadow: false,
                                hwaccel: false,
                                className: "tvp_spinner_object spinner",
                                zIndex: 2000000000,
                                top: "50",
                                left: "auto"
                            }).spin();
                            this.$spinner = this.$el.find(".vjs-loading-spinner").addClass("tvp_spinner").attr("tabindex", 0).empty().append(this.spinner.el);
                            return this
                        },
                        load_file: function (d) {
                            if (!FileReader) {
                                return false
                            }
                            this.show_spinner();
                            var c = new FileReader();
                            c.onload = _.bind(function (f) {
                                this.video_player.src(f.target.result);
                                if (typeof this.config.on_file_load === "function") {
                                    this.config.on_file_load.apply(this, [f, this])
                                }
                            }, this);
                            c.readAsDataURL(d);
                            return this
                        },
                        load_src: function (c) {
                            this.video_player.src(c);
                            if (typeof this.config.on_file_load === "function") {
                                this.config.on_file_load.apply(this, [null, this])
                            }
                            return this
                        },
                        get_inline_style: function (d, g) {
                            var c, f, e = new RegExp("(?:^|[\\s;])" + g + "[^:;]*:\\s*([^;]*)(?:;|$)");
                            if (!(c = b(d).attr("style"))) {
                                return ""
                            }
                            return (f = c.match(e)) ? f[1] : ""
                        },
                        calculate_video_height: function (d) {
                            var c;
                            var e = {};
                            e.height = this.get_inline_style(this.$tag, "height");
                            e["min-height"] = this.get_inline_style(this.$tag, "min-height");
                            e["max-height"] = this.get_inline_style(this.$tag, "max-height");
                            this.$tag.css({
                                height: "auto",
                                "min-height": "0px",
                                "max-height": "none"
                            });
                            if (d) {
                                this.$tag.css("width", d)
                            }
                            c = this.$tag.height();
                            this.$tag.css({
                                height: e.height,
                                "min-height": e["min-height"],
                                "max-height": e["max-height"]
                            });
                            return c
                        },
                        set_auto_height: function (d) {
                            var c = this.calculate_video_height(d);
                            this.$el.height(c)
                        },
                        toggle_play: function () {
                            return this.video_player.paused() ? this.play() : this.pause()
                        },
                        play: function () {
                            this.video_player.play();
                            this.playcount++
                        },
                        pause: function () {
                            this.video_player.pause()
                        },
                        stop: function () {
                            this.seek(0);
                            this.video_player.pause();
                            this.ended()
                        },
                        playing: function (c) {
                            if (!this.has_video_src()) {
                                return false
                            }
                            this.$el.removeClass("paused").addClass("init playing");
                            this.video_player.bigPlayButton.show()
                        },
                        has_video_src: function (d) {
                            if (!this.video_player.currentSrc()) {
                                this.video_player.pause();
                                this.video_player.bigPlayButton.show();
                                if (d) {
                                    try {
                                        d.preventDefault();
                                        d.stopPropagation()
                                    } catch (c) {}
                                }
                                return false
                            }
                            return true
                        },
                        paused: function (c) {
                            this.$el.addClass("paused")
                        },
                        ended: function () {
                            this.$el.removeClass("init playing paused")
                        },
                        seek: function (c) {
                            video_player.currentTime(c)
                        },
                        toggle_fullscreen: function () {
                            return this.enter_fullscreen()
                        },
                        enter_fullscreen: function () {
                            console.log("enter fullscreen")
                        },
                        exit_fullscreen: function () {
                            console.log("exit fullscreen")
                        },
                        set_duration: function (c) {
                            c = (typeof c === "number" ? c : this.video_player.duration());
                            this.controls.time_hud.text(_V_.formatTime(c))
                        },
                        show_spinner: function (c) {
                            if (c && !this.has_video_src()) {
                                return false
                            }
                            this.$el.addClass("show_spinner")
                        },
                        hide_spinner: function () {
                            this.controls.big_play.show();
                            this.$el.removeClass("show_spinner")
                        },
                        load_start: function (c) {
                            this.$el.removeClass("init playing paused has_error");
                            this.show_spinner(true)
                        },
                        waiting: function (c) {
                            this.show_spinner(true)
                        },
                        meta_ready: function (c) {
                            if (this.config.auto_height) {
                                this.set_auto_height()
                            }
                        },
                        show_error: function (c) {
                            this.$el.addClass("has_error");
                            if (typeof this.config.on_error === "function") {
                                this.config.on_error.apply(this, [c, this])
                            }
                        },
                        get_playback_percent: function () {
                            var d = this.video_player.currentTime(),
                                c = this.video_player.duration();
                            return c ? d / c : 0
                        },
                        seek_begin: function () {
                            this.$el.addClass("scrubbing")
                        },
                        seek_end: function (c) {
                            this.$el.removeClass("scrubbing")
                        },
                        add_events: function () {
                            this.$video_controls.click(_.bind(function (c) {
                                if (!this.$video_controls.is(c.target)) {
                                    return false
                                }
                                this.toggle_play();
                                return false
                            }, this));
                            this.controls.remaining_time.click(_.bind(function (c) {
                                this.$el.removeClass("show_remaining_time");
                                return false
                            }, this));
                            this.controls.current_time.click(_.bind(function (c) {
                                this.$el.addClass("show_remaining_time");
                                return false
                            }, this));
                            this.controls.progress_control.on({
                                mouseover: _.bind(function (c) {
                                    this.$el.addClass("show_thumbnails")
                                }, this),
                                mouseout: _.bind(function (c) {
                                    this.$el.removeClass("show_thumbnails")
                                }, this),
                                mousemove: _.bind(function (c) {
                                    var d = this.calculate_distance(c);
                                    this.controls.seek_thumbs_container.css("left", d * this.controls.progress_holder.width());
                                    this.controls.seek_time.text(_V_.formatTime(d * this.video_player.duration(), 2))
                                }, this)
                            });
                            this.bind_videojs_events({
                                play: this.playing,
                                pause: this.paused,
                                ended: this.ended,
                                durationchange: function (c) {
                                    return this.set_duration()
                                },
                                loadstart: this.load_start,
                                waiting: this.waiting,
                                loadedmetadata: this.meta_ready,
                                canplay: this.hide_spinner,
                                canplaythrough: this.hide_spinner,
                                error: this.show_error
                            });
                            return this
                        },
                        bind_videojs_events: function (e, d) {
                            if (typeof e === "string") {
                                var c = e;
                                e = {};
                                e[c] = d
                            }
                            b.each(e, _.bind(function (f, g) {
                                this.video_player.addEvent(f, _.bind(g, this))
                            }, this))
                        },
                        get_seek_bar: function () {
                            return this.video_player.controlBar.progressControl.seekBar
                        },
                        calculate_distance: function (i, g) {
                            var c = this.get_seek_bar();
                            if (g) {
                                return c.calculateDistance(i)
                            }
                            var d = c.el,
                                f = _V_.findPosX(d),
                                h = d.offsetWidth;
                            return Math.max(0, Math.min(1, (event.pageX - f) / h))
                        }
                    })
                })(jQuery);
                var Tumblr = Tumblr || {};
                (function (c, a) {
                    var b = Backbone.View.extend({
                        events: {
                            "click .snap_btn .photo_btn": "onSnapPhotoClick",
                            "click .snap_btn .gif_btn": "onSnapGifClick",
                            "click .retake_btn": "onRetakeClick",
                            "click .flash_toggle": "onFlashToggleClick",
                            "click .x": "onCloseClick"
                        },
                        initialize: function (e) {
                            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia);
                            var d = c.browser;
                            if (d.mozilla && Math.floor(d.version) >= 20) {
                                navigator.getMedia = navigator.mozGetUserMedia
                            }
                            window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL);
                            this.btn = c(e.btn);
                            this.template = (e.template) ? c(e.template).html() : null;
                            this.on_show = e.on_show || function () {};
                            this.on_hide = e.on_hide || function () {};
                            this.on_snap = e.on_snap || function () {};
                            this.on_retake = e.on_retake || function () {};
                            this.is_disabled = (navigator.getMedia) ? false : true;
                            this.is_running = false;
                            this.is_mirrored = true;
                            this.is_flash_on = true;
                            this.is_gif_on = false;
                            this.is_flash_disabled = false;
                            this.is_countdown_disabled = false;
                            this.stream_timeout = null;
                            this.stream = null;
                            this.timer = null;
                            this.timer_delay = 3;
                            this.stream_delay = 60;
                            this.gif_frame_count = 4;
                            this.gif_queue = [];
                            this.gif_worker_url = "";
                            this.video = document.createElement("video");
                            this.photo = null;
                            this.flash = c('<div id="webcam_flash"></div>');
                            this.arrow = c('<div id="webcam_arrow"></div>');
                            if (!this.btn) {
                                return
                            }(this.is_disabled) ? this.btn.remove() : this.btn.on("click", c.proxy(this.onWebcamClick, this));
                            this.setup()
                        },
                        setup: function () {
                            this.video.controls = false;
                            if (this.is_mirrored) {
                                this.video.className = "mirrored"
                            }
                        },
                        show: function () {
                            if (this.is_disabled) {
                                return
                            }
                            var e, d = false;
                            if (this.stream_timeout) {
                                clearTimeout(this.stream_timeout);
                                this.stream_timeout = null
                            }
                            if (this.is_running) {
                                c(this.video).show();
                                if (this.stream) {
                                    this.showControl(".snap_btn");
                                    return
                                }
                            } else {
                                this.$el.show().append(c(this.video).show());
                                this.on_show();
                                d = true
                            }
                            this.is_running = true;
                            c("body").append(this.arrow.show());
                            this.$el.addClass("loading");
                            c(window).on("keydown.webcam", c.proxy(this.onKeyDown, this));
                            c(window).on("keyup.webcam", c.proxy(this.onKeyUp, this));
                            navigator.getMedia({
                                video: true
                            }, c.proxy(function (g) {
                                if (d) {
                                    if (this.template) {
                                        if (this.usingHandlebarTemplates) {
                                            var f = Handlebars.compile(this.template)
                                        } else {
                                            var f = _.template(this.template)
                                        }
                                        this.$el.append(f({
                                            webcam: true,
                                            controls: true,
                                            linkthrough: true,
                                            width: 500
                                        }))
                                    }
                                    this.is_running = true
                                }
                                this.$el.removeClass("loading");
                                this.arrow.fadeOut(200, c.proxy(function () {
                                    this.arrow.remove()
                                }, this));
                                this.showControl(".snap_btn");
                                this.stream = g;
                                this.video.src = window.URL.createObjectURL(this.stream);
                                this.video.play()
                            }, this), c.proxy(function (f) {
                                this.destroy();
                                return
                            }, this))
                        },
                        snap: function () {
                            var e = this,
                                j = this.$el.find(".countdown"),
                                f, g, d, i;
                            f = document.createElement("canvas");
                            f.width = (this.is_gif_on) ? this.$el.width() : this.video.clientWidth;
                            f.height = (this.is_gif_on) ? this.$el.height() : this.video.clientHeight;
                            if (this.is_flash_on && !this.is_flash_disabled) {
                                c("body").append(this.flash.stop(true, true).show());
                                setTimeout(k, 250)
                            } else {
                                k();
                                j.addClass("pulse");
                                setTimeout(function () {
                                    j.removeClass("pulse")
                                }, 500)
                            }

                            function k() {
                                if (e.is_flash_on && !e.is_flash_disabled) {
                                    e.flash.fadeOut(500, c.proxy(function () {
                                        c(e).remove()
                                    }, e))
                                }
                                g = f.getContext("2d");
                                d = f.width;
                                i = f.height;
                                if (e.is_mirrored) {
                                    g.translate(f.width, 0);
                                    g.scale(-1, 1)
                                }
                                g.drawImage(e.video, 0, 0, d, i);
                                if (e.is_gif_on) {
                                    e.gifSnap(f)
                                } else {
                                    e.preview(f)
                                }
                            }
                        },
                        gifSnap: function (d) {
                            this.gif_queue.push(d);
                            if (this.gif_queue.length < this.gif_frame_count) {
                                setTimeout(c.proxy(this.snap, this), 1000)
                            } else {
                                this.showControl(".processing");
                                if (this.gif_worker_url) {
                                    this.createGif();
                                    return
                                }
                                c.ajax({
                                    url: this.$el.data("gifworker"),
                                    success: c.proxy(function (g) {
                                        var f;
                                        try {
                                            f = new Blob([g])
                                        } catch (h) {
                                            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                                            f = new BlobBuilder();
                                            f.append(g);
                                            f = f.getBlob()
                                        }
                                        this.gif_worker_url = window.URL.createObjectURL(f);
                                        this.createGif()
                                    }, this)
                                })
                            }
                        },
                        createGif: function () {
                            var e = new GIF({
                                workerScript: this.gif_worker_url,
                                workers: 3,
                                quality: 1
                            });
                            for (var f = 0, d = this.gif_queue.length; f < d; f++) {
                                e.addFrame(this.gif_queue[f], {
                                    delay: 200
                                })
                            }
                            e.on("finished", c.proxy(this.onGifFinished, this));
                            e.render()
                        },
                        preview: function (f) {
                            var g, d, e;
                            this.photo = f;
                            c(this.video).hide().before(f);
                            this.stream_timeout = setTimeout(c.proxy(this.onStreamTimeout, this), this.stream_delay * 1000);
                            this.$el.find(".countdown").removeClass("pulse");
                            this.showControl(".retake_btn");
                            g = (this.is_gif_on) ? f.src : f.toDataURL("image/jpeg");
                            d = c(f).width();
                            e = c(f).height();
                            this.on_snap(g, d, e, this.is_gif_on)
                        },
                        retake: function () {
                            if (!this.is_gif_on) {
                                var d = this.photo.getContext("2d");
                                d.clearRect(0, 0, this.photo.width, this.photo.height)
                            }
                            this.is_gif_on = false;
                            c(this.photo).remove();
                            this.show();
                            this.on_retake()
                        },
                        destroy: function () {
                            this.$el.removeClass("loading").hide().html("");
                            if (this.timer) {
                                clearInterval(this.timer)
                            }
                            if (this.stream_timeout) {
                                clearTimeout(this.stream_timeout)
                            }
                            if (this.stream) {
                                this.onStreamTimeout()
                            }
                            this.is_running = false;
                            this.is_gif_on = false;
                            this.arrow.remove();
                            this.$el.find(".countdown").removeClass("gif");
                            c(window).off("keydown.webcam");
                            c(window).off("keyup.webcam");
                            this.on_hide()
                        },
                        countdown: function (f, h) {
                            var d = this.$el.find(".countdown").removeClass("full").addClass("half"),
                                g = f * 0.5,
                                e = 1;
                            d.find(".loader").css({
                                "-webkit-animation-duration": g + "s",
                                "-moz-animation-duration": g + "s",
                                "-ms-animation-duration": g + "s",
                                "-o-animation-duration": g + "s",
                                "animation-duration": g + "s"
                            });
                            this.showControl(".countdown");
                            this.timer = setInterval(c.proxy(function () {
                                if (e > 1) {
                                    clearInterval(this.timer);
                                    if (h) {
                                        h()
                                    }
                                } else {
                                    d.removeClass("half").addClass("full");
                                    e++
                                }
                            }, this), g * 1000)
                        },
                        showControl: function (d) {
                            this.$el.find(".control_btn").removeClass("animate").hide();
                            if (d) {
                                this.$el.find(d).show().addClass("animate")
                            }
                        },
                        onGifFinished: function (f) {
                            var e = new Image(),
                                d = new FileReader();
                            e.className = "preview";
                            c(d).on("load", c.proxy(function (g) {
                                e.src = g.target.result;
                                this.preview(e);
                                c(d).off()
                            }, this));
                            this.gif_queue = [];
                            d.readAsDataURL(f)
                        },
                        onWebcamClick: function (d) {
                            d.preventDefault();
                            this.show()
                        },
                        onSnapGifClick: function (g) {
                            g.preventDefault();
                            var f = this.$el.find(".countdown"),
                                d = this.gif_frame_count;
                            if (this.is_flash_on && !this.is_flash_disabled) {
                                d += (this.gif_frame_count - 1) * 0.25
                            }
                            this.is_gif_on = true;
                            f.addClass("gif");
                            this.countdown(d, c.proxy(function () {
                                f.removeClass("gif")
                            }));
                            setTimeout(c.proxy(this.snap, this), 1000)
                        },
                        onSnapPhotoClick: function (d) {
                            d.preventDefault();
                            if (this.is_countdown_disabled) {
                                this.snap();
                                return
                            }
                            this.countdown(this.timer_delay, c.proxy(this.snap, this))
                        },
                        onStreamTimeout: function () {
                            if (this.stream) {
                                this.stream.stop();
                                this.stream = null
                            }
                            this.video.src = "";
                            this.stream_timeout = null
                        },
                        onKeyDown: function (d) {
                            switch (d.keyCode) {
                            case 17:
                            case 18:
                                this.is_countdown_disabled = true;
                                break;
                            case 16:
                                this.is_flash_disabled = true;
                                break
                            }
                        },
                        onKeyUp: function (d) {
                            this.is_flash_disabled = false;
                            this.is_countdown_disabled = false
                        },
                        onFlashToggleClick: function (d) {
                            d.preventDefault();
                            c(d.currentTarget).toggleClass("off");
                            this.is_flash_on = !c(d.currentTarget).hasClass("off")
                        },
                        onRetakeClick: function (d) {
                            d.preventDefault();
                            c(d.currentTarget).hide();
                            this.retake()
                        },
                        onCloseClick: function (d) {
                            d.preventDefault();
                            this.destroy()
                        }
                    });
                    a.Webcam = b
                })(jQuery, Tumblr);