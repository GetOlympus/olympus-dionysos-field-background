<?php

namespace GetOlympus\Dionysos\Field;

use GetOlympus\Zeus\Field\Field;

/**
 * Builds Background field.
 *
 * @package    DionysosField
 * @subpackage Background
 * @author     Achraf Chouk <achrafchouk@gmail.com>
 * @since      0.0.1
 *
 */

class Background extends Field
{
    /**
     * @var array
     */
    protected $adminscripts = ['enqueue_media', 'wp-color-picker'];

    /**
     * @var array
     */
    protected $adminstyles = ['wp-color-picker'];

    /**
     * @var string
     */
    protected $script = 'js'.S.'background.js';

    /**
     * @var string
     */
    protected $style = 'css'.S.'background.css';

    /**
     * @var string
     */
    protected $template = 'background.html.twig';

    /**
     * @var string
     */
    protected $textdomain = 'backgroundfield';

    /**
     * Prepare defaults.
     *
     * @return array
     */
    protected function getDefaults() : array
    {
        return [
            'title' => parent::t('background.title', $this->textdomain),
            'can_upload' => false,
            'default' => [],
            'description' => '',
            'size' => 'thumbnail',

            // settings
            'settings' => [
                'upload'  => true,

                /**
                 * Color picker settings
                 * @see https://core.trac.wordpress.org/browser/trunk/src/js/_enqueues/lib/color-picker.js
                 */
                'color' => [
                    'defaultColor' => false,
                    'hide'         => true,
                    'palettes'     => true,
                    'width'        => 255,
                    'mode'         => 'hsv',
                    'type'         => 'full',
                    'slider'       => 'horizontal',
                ],
            ],

            // texts
            't_preview_label'     => parent::t('background.preview_label', $this->textdomain),

            't_attachment_label'  => parent::t('background.attachment_label', $this->textdomain),
            't_color_label'       => parent::t('background.color_label', $this->textdomain),
            't_image_label'       => parent::t('background.image_label', $this->textdomain),
            't_position_label'    => parent::t('background.position_label', $this->textdomain),
            't_repeat_label'      => parent::t('background.repeat_label', $this->textdomain),
            't_size_label'        => parent::t('background.size_label', $this->textdomain),
            't_editblock_label'   => parent::t('background.editblock_label', $this->textdomain),

            't_attachment_fixed'  => parent::t('background.attachment_fixed', $this->textdomain),
            't_attachment_local'  => parent::t('background.attachment_local', $this->textdomain),
            't_attachment_scroll' => parent::t('background.attachment_scroll', $this->textdomain),

            't_default_inherit'  => parent::t('background.default_inherit', $this->textdomain),
            't_default_initial'  => parent::t('background.default_initial', $this->textdomain),
            't_default_unset'    => parent::t('background.default_unset', $this->textdomain),

            't_repeat_no-repeat' => parent::t('background.repeat_no-repeat', $this->textdomain),
            't_repeat_repeat'    => parent::t('background.repeat_repeat', $this->textdomain),
            't_repeat_repeat-x'  => parent::t('background.repeat_repeat-x', $this->textdomain),
            't_repeat_repeat-y'  => parent::t('background.repeat_repeat-y', $this->textdomain),
            't_repeat_round'     => parent::t('background.repeat_round', $this->textdomain),
            't_repeat_space'     => parent::t('background.repeat_space', $this->textdomain),

            't_size_auto'    => parent::t('background.size_auto', $this->textdomain),
            't_size_contain' => parent::t('background.size_contain', $this->textdomain),
            't_size_cover'   => parent::t('background.size_cover', $this->textdomain),
        ];
    }

    /**
     * Prepare variables.
     *
     * @param  object  $value
     * @param  array   $contents
     *
     * @return array
     */
    protected function getVars($value, $contents) : array
    {
        // Available repeats and sizes
        $attachments = ['inherit', 'initial', 'fixed', 'local', 'scroll'];
        $repeats = ['inherit', 'initial', 'no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'round', 'space', 'unset'];
        $sizes = ['inherit', 'initial', 'auto', 'contain', 'cover', 'unset'];

        // Get contents
        $vars = $contents;

        // Retrieve field value
        $vars['value'] = !is_array($value) ? [$value] : $value;

        // Configurations
        $vars['attachments'] = $attachments;
        $vars['repeats'] = $repeats;
        $vars['sizes'] = $sizes;

        // Settings
        $vars['settings'] = array_merge([
            'upload'  => true,
        ], $vars['settings']);

        // Special case
        if (!$vars['settings']['upload']) {
            $vars['settings']['preview'] = false;
        }

        // Check if user can upload
        $vars['can_upload'] = current_user_can('upload_files');

        // Check if user can upload
        $vars['default_image'] = $this->getDefaultImage();

        // Update vars
        return $vars;
    }

    /**
     * Get default image.
     *
     * @return string
     */
    protected function getDefaultImage() : string
    {
        // Default image in base 64
        return 'data:image/png;base64,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';
    }
}
