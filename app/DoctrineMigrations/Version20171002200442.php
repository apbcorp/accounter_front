<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171002200442 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE `ground` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `kontragent_id` INT(11) UNSIGNED DEFAULT NULL,
            `acc_number` INT(11) UNSIGNED NOT NULL DEFAULT 0,
            `number` INT(11) UNSIGNED NOT NULL DEFAULT 0,
            `line` INT(11) UNSIGNED NOT NULL DEFAULT 0,
            `ground_number` INT(11) UNSIGNED NOT NULL DEFAULT 0,
            `area` DECIMAL(7,3) NOT NULL DEFAULT 0,
            `free_area` DECIMAL(7,3) NOT NULL DEFAULT 0,
            `common_area` DECIMAL(7,3) NOT NULL DEFAULT 0,
            `all_area` DECIMAL(7,3) NOT NULL DEFAULT 0,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE `ground`;
        ');
    }
}
